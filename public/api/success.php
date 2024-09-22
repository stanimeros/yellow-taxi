<?php
    require("connect.php");

    if (isset($_GET["id"], $_GET["token"])) {
        $sql = "UPDATE trips SET paid = 1 WHERE id = ? AND token = ?;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $_GET["id"], $_GET["token"]);
        $stmt->execute();
        $stmt->close();
    }

    $conn -> close();
    header("Location: https://yellow-taxi.stanimeros.com/success");
?>
