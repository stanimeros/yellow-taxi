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

        $rawPickupDate = $data['pickupDateTime'];
        $dateObject = DateTime::createFromFormat('Y-m-d\TH:i:s.u\Z', $rawPickupDate);
        $pickupDate = $dateObject->format('Y-m-d H:i:s');

        if ($data['returnDate']){
            $rawReturnDate = $data['returnDate'];
            $dateObject = DateTime::createFromFormat('Y-m-d\TH:i:s.u\Z', $rawReturnDate);
            $returnDate = $dateObject->format('Y-m-d H:i:s');
        }else{
           $returnDate = null;
        }

        $token = substr(sha1(rand()), 0, 32);
        $sql = "INSERT INTO trips (from_place_id, to_place_id, pickup_date, return_date, adults, children, infants, name, email, phone, transport, comments, category, price, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ? ,?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssiiissssssss", $data['from_place_id'], $data['to_place_id'], $pickupDate, $returnDate, $data['adults'], $data['children'], $data['infants'], $data['name'], $data['email'], $data['phone'], $data['transport'], $data['comments'] ,$data['category'], $data['price'], $token);
        $stmt->execute();
        $id = $stmt->insert_id;
        $stmt->close();

            startDestination: startDestination,
            endDestinationId: endDestination,
            pickupDateTime: pickupDateTime?.toISOString(),
            returnDateTime: returnDateTime?.toISOString(),
            adults: adults,
            children: children,
            luggage: luggage,
            vehicleOption: vehicleOption,
            email: email,
            name: name,
            areaCode: areaCode,
            phone: phone,
            ferryName: ferryName,
            airplaneName: airplaneName,
            infantSeats: infantSeats, 
            babySeats: babySeats,
            boosterSeats: boosterSeats,
            bulkyLuggage: bulkyLuggage,
            notes: notes,
            coupons: coupons

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