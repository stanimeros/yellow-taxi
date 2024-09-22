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

        $price = getPricing($data['startDestinationId'], $data['endDestinationId'], $data['returnDateTime'], $data['vehicleOptionId'], $data['coupons'], $conn);
        $price = number_format($price, 2, '.', '');

        $token = substr(sha1(rand()), 0, 32);
        $sql = "INSERT INTO trips (from_place_id, to_place_id, pickup_datetime, return_datetime, adults, children, option_id, name, email, phone, price, token, luggage, ferryName, airplaneName, infantSeats, babySeats, boosterSeats, bulkyLuggage, notes, coupons) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssiiisssssissiiiiss", $data['startDestinationId'], $data['endDestinationId'], $data['pickupDateTime'], $data['returnDateTime'], $data['adults'], $data['children'], $data['vehicleOptionId'], $data['name'], $data['email'], $data['phone'], $price, $token, $data['luggage'], $data['ferryName'], $data['airplaneName'], $data['infantSeats'], $data['babySeats'], $data['boosterSeats'], $data['bulkyLuggage'], $data['notes'], $data['coupons']);
        $stmt->execute();
        $id = $stmt->insert_id;
        $stmt->close();

        // $stripePrivateKey = $keys['stripe_private_key'];
        $stripePrivateKey = $keys['test_stripe_private_key'];
        $product_name = $data['returnDateTime'] ? (' Round Trip #' . $id) : (' One Way Trip #' . $id);

        \Stripe\Stripe::setApiKey($stripePrivateKey);
        $checkout_session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'unit_amount' => $price * 100, // Stripe accepts amounts in cents
                    'product_data' => [
                        'name' => $product_name,
                    ],
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => 'https://yellow-taxi.stanimeros.com/api/success.php?id=' . $id . '&token=' . $token,
            'cancel_url' => 'https://yellow-taxi.stanimeros.com/cancelled',
        ]);
    
        $redirect_url = $checkout_session->url;
        print json_encode(['status' => 'success', 'redirect_url' => $redirect_url]);
    }else{
        echo json_encode(['status' => 'failed', 'message' => 'Invalid inputs']);
    }

    $conn -> close();
?>