<?php  
    require ("connect.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        $price = getPricing($data['startId'], $data['endId'], $conn);
        if ($data['returnDate'] != null){
            $price *= 1.8; //Apply 20% discount
        }

        if ($data['optionId'] != null){
            $price *= getOptionPriceRate($data['optionId'], $conn);
        }

        $coupons_discount = applyCoupons($data['coupons'], $conn);
        $price *= $coupons_discount;
        $price = number_format($price, 2, '.', '');
        
        echo json_encode(['status' => 'success', 'price' => $price, 'coupons_discount' => $coupons_discount]);
    }else{
        echo json_encode(['status' => 'failed', 'message' => 'Invalid method']);
    }
    $conn -> close();
?>