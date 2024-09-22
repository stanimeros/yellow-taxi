<?php
    if (!file_exists('/home/u321831237/domains/stanimeros.com/public_html/vendor/autoload.php')) {
        echo json_encode(['status' => 'failed', 'message' => 'Missing libraries']);
        exit();
    }

    require("connect.php");
    require "/home/u321831237/domains/stanimeros.com/public_html/vendor/autoload.php";

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        $rawPickupDateTime = $data['pickupDateTime'];
        $dateObject = DateTime::createFromFormat('Y-m-d\TH:i:s.u\Z', $rawPickupDateTime);
        $pickupDateTime = $dateObject->format('Y-m-d H:i:s');

        if ($data['returnDateTime']){
            $rawReturnDateTime = $data['returnDateTime'];
            $dateObject = DateTime::createFromFormat('Y-m-d\TH:i:s.u\Z', $rawReturnDateTime);
            $returnDateTime = $dateObject->format('Y-m-d H:i:s');
        }else{
           $returnDate = null;
        }

        $phone = $data['areaCode'] . $data['phone'];

        $token = substr(sha1(rand()), 0, 32);
        $sql = "INSERT INTO trips (from_place_id, to_place_id, pickup_datetime, return_datetime, adults, children, option_id, name, email, phone, price, token, luggage, ferryName, airplaneName, infantSeats, babySeats, boosterSeats, bulkyLuggage, notes, coupons) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssiiisssssssssssss", $data['startDestinationId'], $data['endDestinationId'], $pickupDateTime, $returnDateTime, $data['adults'], $data['children'], $data['vehicleOption'], $data['name'], $data['email'], $phone, $data['price'], $token, $data['luggage'], $data['ferryName'], $data['airplaneName'], $data['infantSeats'], $data['babySeats'], $data['boosterSeats'], $data['bulkyLuggage'], $data['notes'], $data['coupons']);
        $stmt->execute();
        $id = $stmt->insert_id;
        $stmt->close();

        require_once("keys.php");
        // $stripePrivateKey = $keys['stripe_private_key'];
        $stripePrivateKey = $keys['test_stripe_private_key'];
        $product_name = $returnDate ? ($data['category'] . ' Round Trip #' . $id) : ($data['category'] . ' One Way Trip #' . $id);

        \Stripe\Stripe::setApiKey($stripePrivateKey);
        $checkout_session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'unit_amount' => $data['price'] * 100, // Stripe accepts amounts in cents
                    'product_data' => [
                        'name' => $product_name,
                    ],
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => 'https://yellow-van.stanimeros.com/api/success.php?id=' . $id . '&token=' . $token,
            'cancel_url' => 'https://yellow-van.stanimeros.com/cancelled',
        ]);
    
        // http_response_code(303);
        // header("Location: " . $checkout_session->url);
    
        $redirect_url = $checkout_session->url;
        print json_encode(['status' => 'success', 'redirect_url' => $redirect_url]);
    }else{
        echo json_encode(['status' => 'failed', 'message' => 'Invalid inputs']);
    }

    $conn -> close();
?>