<?php  
    require("connect.php");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);

        $options = [];
        $price = getPricing($data['startId'], $data['endId'], $data['returnDate'], null, $data['coupons'], $conn);

        $sql = "SELECT * FROM options WHERE max_passengers >= ?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $data['passengers']);
        $stmt->execute(); 
        $result = $stmt->get_result(); 
        $stmt->close();
        $options = $result->fetch_all(MYSQLI_ASSOC);

        foreach ($options as &$option) {
            $option['price'] = number_format($option['price_rate'] * $price, 2, '.', '');
        }
        
        echo json_encode(['status' => 'success', 'options' => $options]);
        
    }else{
        echo json_encode(['status' => 'failed', 'message' => 'Invalid method']);
    }
    $conn -> close();
?>