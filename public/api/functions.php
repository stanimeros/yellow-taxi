<?php

    function getPlaceDetails($placeID, $conn){
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
        . '&key=AIzaSyBtKu69Duk5h4_0jvwvYOFH5-Igl7rAQq4';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        if(curl_errno($ch)){
            $error_msg = curl_error($ch);
            curl_close($ch);
            return "Error in getPlaceDetails: $error_msg";
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

        if ($num_predictions == 5) {
            return $predictions;
        }

        //Get predictions from Google
        $url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?'
        . 'input=' . urlencode($input)
        . '&types=establishment'
        . '&components=country:gr'
        . '&key=AIzaSyBtKu69Duk5h4_0jvwvYOFH5-Igl7rAQq4';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        print($response);

        if(curl_errno($ch)){
            $error_msg = curl_error($ch);
            curl_close($ch);
            return "Error in getPredictions: $error_msg";
        }
        curl_close($ch);
        
        //Update local database
        $array_data = json_decode($response, true);
        $predictions = $array_data['predictions'];
        foreach ($predictions as $prediction) {
            $sql = "INSERT IGNORE INTO google_places (place_id, description) VALUES (?, ?);";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $prediction['place_id'], $prediction['description']);
            $stmt->execute();
            $stmt->close();
        }

        return $predictions;
    }

    function getPricing($from_id, $to_id, $conn){
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
            
            return $min_price;
        } else {
            $route = getDirections($from_id, $to_id);
            $price = (float) $route['distance'] * 2;
        
            return $price;
        }

    }

    function getDirections($from_id, $to_id){
        $url = 'https://maps.googleapis.com/maps/api/directions/json?'
        . 'origin=place_id:' . $from_id
        . '&destination=place_id:' . $to_id
        . '&mode=driving'
        . '&key=AIzaSyBtKu69Duk5h4_0jvwvYOFH5-Igl7rAQq4';
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);

        if(curl_errno($ch)){
            $error_msg = curl_error($ch);
            curl_close($ch);
            return "Error in getDirections: $error_msg";
        }
        curl_close($ch);

        $data = json_decode($response, true);
        if ($data['routes']){
            $route = $data['routes'][0];
            $distance = $route['legs'][0]['distance']['text'];
            $duration = $route['legs'][0]['duration']['text'];
        }else{
            $distance = 10; //Test Values FIXME
            $duration = 10; //Test Values FIXME
        }

        return ['distance' => $distance, 'duration' => $duration];
    }
    
?>