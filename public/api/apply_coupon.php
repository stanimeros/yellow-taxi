<?php  
    require("connect.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        $price = getPricing($data['startId'], $data['endId'], $data['returnDate'], $data['optionId'], $data['coupons'], $conn);
        $price = number_format($price, 2, '.', '');
        echo json_encode(['status' => 'success', 'price' => $price);
    }else{
        echo json_encode(['status' => 'failed', 'message' => 'Invalid method']);
    }
    $conn -> close();
?>