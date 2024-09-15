<?php
    require ("connect.php");
      
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        if (empty($data['startId']) || empty($data['endId'])) {
            $price = getPricing('ChIJYVzn2RqQoRQRqrPuCt8Vsjg', 'ChIJU7Khupu9oRQRj-kopj1iZS8', $conn);
        } else {
            $price = getPricing($data['startId'], $data['endId'], $conn);
        }

        $categories = [];

        if ($data['returnDate'] != null){
            $rawReturnDate = $data['returnDate'];
            $dateObject = DateTime::createFromFormat('Y-m-d\TH:i:s.u\Z', $rawReturnDate);
            $returnDate = $dateObject->format('Y-m-d H:i:s');
            $price = $price * 1.8; //Apply 20% discount
        }

        if ($data['passengers'] <= 5){
            $categories = [
                [
                    'id' => '1',
                    'title' => 'Economy Taxi',
                    'image_url' => 'https://www.transfeero.com/mainjs/img/economy.png',
                    'description' => 'Affordable transportation option',
                    'price' => round($price),
                    'models' => 'Model A, Model B',
                    'passengers' => 4,
                    'suitcases' => 2,
                    'features' => ['AC', 'Radio']
                ],
                [
                    'id' => '2',
                    'title' => 'Premium Taxi',
                    'image_url' => 'https://www.transfeero.com/mainjs/img/standard.png',
                    'description' => 'Luxury transportation option',
                    'price' => round($price * 1.2),
                    'models' => 'Model C, Model D',
                    'passengers' => 3,
                    'suitcases' => 3,
                    'features' => ['Leather seats', 'Entertainment system']
                ],
            ];
        }

        $categories = array_merge($categories, [
            [
                'id' => '3',
                'title' => 'Van',
                'image_url' => 'https://www.transfeero.com/mainjs/img/standard_van.png',
                'description' => 'Spacious transportation option',
                'price' => round($price * 1.7),
                'models' => 'Model E, Model F',
                'passengers' => 8,
                'suitcases' => 6,
                'features' => ['Large cargo space', 'Sliding doors']
            ],
            [
                'id' => '4',
                'title' => 'Mini Bus',
                'image_url' => 'https://www.transfeero.com/mainjs/img/minibus.png',
                'description' => 'Group transportation option',
                'price' => round($price * 2.5),
                'models' => 'Model G, Model H',
                'passengers' => 15,
                'suitcases' => 10,
                'features' => ['TV screens', 'Comfortable seating']
            ]
        ]);
        
        echo json_encode(['status' => 'success', 'categories' => $categories]);
    }else{
        echo json_encode(['status' => 'failed', 'message' => 'Invalid method']);
    }
?>