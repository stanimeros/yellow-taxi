<?php

    function getPlaceDetails($placeID, $conn){
        require("keys.php");
        //Get place details from local database
        $sql = "SELECT longitude, latitude FROM google_places WHERE place_id = ?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $placeID);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        // Check if result is null
        $row = $result->fetch_assoc();
        if ($row && isset($row['longitude']) && isset($row['latitude'])) {
            return $row;
        }

        //Get place details from Google
        $url = 'https://maps.googleapis.com/maps/api/place/details/json?'
        . 'placeid=' . urlencode($placeID)
        . '&fields=geometry'
        . '&key=' . $keys['google_maps_api_key'];
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        if(curl_errno($ch)){
            $error_msg = curl_error($ch);
            curl_close($ch);
            echo json_encode(['status' => 'failed', 'message' => 'Error: ' . $error_msg]);
            $conn -> close();
            exit();
        }

        curl_close($ch);

        $data = json_decode($response, true);
        $longitude = $data['result']['geometry']['location']['lng'];
        $latitude = $data['result']['geometry']['location']['lat'];
        
        //Update local database
        $sql = "UPDATE google_places SET longitude = ?, latitude = ? WHERE place_id = ?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $longitude, $latitude, $placeID);
        $stmt->execute();
        $stmt->close();

        return ['longitude' => $longitude, 'latitude' => $latitude];
    }

    function getPredictions($input, $conn){
        //Get predictions from local database
        $sql = "SELECT place_id, description FROM google_places WHERE description LIKE ? LIMIT 5;";
        $stmt = $conn->prepare($sql);
        $user_input = $input . '%';
        $stmt->bind_param("s", $user_input);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $predictions = $result->fetch_all(MYSQLI_ASSOC);
        $num_predictions = count($predictions);

        if ($num_predictions >= 5) {
            return $predictions;
        }

        //Get predictions from Google
        require("keys.php");
        $url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?'
        . 'input=' . urlencode($input)
        . '&types=establishment'
        . '&components=country:gr'
        . '&key=' . $keys['google_maps_api_key'];
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        if(curl_errno($ch)){
            $error_msg = curl_error($ch);
            curl_close($ch);
            echo json_encode(['status' => 'failed', 'message' => 'Error: ' . $error_msg]); 
            $conn -> close();
            exit();
        }
        curl_close($ch);

        //Update local database
        $array_data = json_decode($response, true);
        $predictions = $array_data['predictions'];
        foreach ($predictions as $prediction) {
            $url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' 
            . $prediction['place_id'] 
            . '&fields=geometry'
            . '&key=' . $keys['google_maps_api_key'];
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);

            if(curl_errno($ch)){
                $error_msg = curl_error($ch);
                curl_close($ch);
                echo json_encode(['status' => 'failed', 'message' => 'Error: ' . $error_msg]); 
                $conn -> close();
                exit();
            }
            curl_close($ch);

            $details = json_decode($response, true);
            $geometry = $details['result']['geometry'];
            $longitude = $geometry['location']['lng'];
            $latitude = $geometry['location']['lat'];

            $sql = "INSERT IGNORE INTO google_places (place_id, description, longitude, latitude) VALUES (?, ?, ?, ?);";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssdd", $prediction['place_id'], $prediction['description'], $longitude, $latitude);
            $stmt->execute();
            $stmt->close();
        }

        return $predictions;
    }

    function getPricing($from_id, $to_id, $return_datetime, $option_id, $coupons, $conn){
        $sql = "SELECT *
        FROM pricing
        WHERE 
            pricing.from_place_id IN (
                SELECT place_id 
                FROM google_places
                WHERE ST_Distance_Sphere(
                    POINT(google_places.longitude, google_places.latitude),
                    POINT((SELECT longitude FROM google_places WHERE place_id = ?), (SELECT latitude FROM google_places WHERE place_id = ?))
                ) <= 10000
            )
            AND pricing.to_place_id IN (
                SELECT place_id
                FROM google_places
                WHERE ST_Distance_Sphere(
                    POINT(google_places.longitude, google_places.latitude),
                    POINT((SELECT longitude FROM google_places WHERE place_id = ?), (SELECT latitude FROM google_places WHERE place_id = ?))
                ) <= 10000
            );
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $from_id, $from_id, $to_id, $to_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $prices = $result->fetch_all(MYSQLI_ASSOC);
        $count_prices = count($prices);

        if ($count_prices > 0){
            $price_values = array_column($prices, 'price');
            $min_price = min($price_values);
            
            $price = $min_price;
        } else {
            $route = getDirections($from_id, $to_id);
            $price = floatval($route['distance']) * 2;
        }

        if ($return_datetime != null){
            $price *= 1.8; //Apply 20% discount
        }

        if ($option_id != null){
            $price *= getOptionPriceRate($option_id, $conn);
        }

        $coupons_discount = applyCoupons($coupons, $conn);
        $price *= $coupons_discount;
        return $price;
    }

    function getOptionPriceRate($option_id, $conn){
        $sql = "SELECT price_rate FROM options WHERE id = ?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $option_id);
        $stmt->execute(); 
        $result = $stmt->get_result(); 
        $row = $result->fetch_assoc(); // Fetch the result into a variable
        $stmt->close(); 
        return $row['price_rate']; // Return the fetched price_rate
    }

    function applyCoupons($coupons, $conn){
        if (empty($coupons)){
            return 1;
        }

        $coupon_values = explode(',', $coupons);
        if (count($coupon_values) > 1){
            $placeholders = implode(', ', array_fill(0, count($coupon_values), '?'));
            $sql = "SELECT SUM(rate) AS combined_rate, COUNT(*) AS count FROM coupons WHERE coupon IN ($placeholders) AND canCombine = '1';";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param(str_repeat('s', count($coupon_values)), ...$coupon_values); // Add bind_param with placeholders value
            $stmt->execute();   
            $result = $stmt->get_result();
            $stmt->close();
            $row = $result->fetch_assoc();
            if ($row['count'] != count($coupon_values)){
                echo json_encode(['status' => 'failed', 'message' => 'Invalid coupon combination']);
                $conn -> close(); 
                exit();
            }

            return number_format(1 - (floatval($row['combined_rate']) ?? 0), 3, '.', '');
        }else if (count($coupon_values) == 1){
            $sql = "SELECT rate FROM coupons WHERE coupon = ?;";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $coupon_values[0]);
            $stmt->execute(); 
            $result = $stmt->get_result(); 
            $stmt->close(); 
            if ($result->num_rows === 0) {
                echo json_encode(['status' => 'failed', 'message' => 'Coupon not found']);
                $conn->close();
                exit();
            }
            return number_format(1 - (floatval($result->fetch_assoc()['rate']) ?? 0), 3, '.', '');
        }
    }

    function getDirections($from_id, $to_id){
        require("keys.php");
        $url = 'https://maps.googleapis.com/maps/api/directions/json?'
        . 'origin=place_id:' . $from_id
        . '&destination=place_id:' . $to_id
        . '&mode=driving'
        . '&key=' . $keys['google_maps_api_key'];
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        if(curl_errno($ch)){
            $error_msg = curl_error($ch);
            curl_close($ch);
            // echo json_encode(['status' => 'failed', 'message' => 'Error: ' . $error_msg]); 
            // $conn -> close();
            // exit();
        }
        curl_close($ch);

        $data = json_decode($response, true);
        if ($data != null && $data['routes']){
            $route = $data['routes'][0];
            $distance = $route['legs'][0]['distance']['text'];
            $duration = $route['legs'][0]['duration']['text'];
        }

        return ['distance' => $distance, 'duration' => $duration];
    }
?> 