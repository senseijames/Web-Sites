<?php
/*
	url_variables.sender_name = name_field.text;
	url_variables.sender_email = email_address_field.text;
	url_variables.subject = subject_field.text;
	url_variables.content = message_field.text;
*/

	$sender_name = $_POST['customer_first_name'] . ' ' . $_POST['customer_last_name'];
	$sender_phone = '(' . $_POST['customer_phone_1'] . ') ' . $_POST['customer_phone_2'] . '-' . $_POST['customer_phone_3'];
	$sender_email = $_POST['customer_email'];
	$message_content = $_POST['customer_message'];
//	$subject = $_POST['customer_message'];
	
	
	$content = "A new message from LevysPools.com sent by " . $sender_name . " width phone number: " . $sender_phone . " from email address " . $sender_email . " reads:<br/><br/>";
	$content .= $message_content;
	
	$content_for_sender = "You have sent the following email via LevysPools.com; here is a copy for your records:<br/><br/>";
	$content_for_sender .= $content;
	
//	$email_address = 'contact@denovoca.com' . ', ' . $sender_email;
	
	// if (sending_ip_address != deNovoca.com) exit;
	// Need to add a safeguard here - do not allow more than ten emails per ip address
	// per day, for example.
	
//	$headers = "From: " . $sender_name . "<" . $sender_email . ">\r\n";
//	$headers = "From: deNovoca.com-'" . $sender_name . "' " . $sender_email;
	 
	$headers = "X-Mailer: PHP 5.2\r\n";  
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
	$headers .= "From: levysPools.com " . $sender_name . "<" . $sender_email . ">\r\n";
//	$headers .= "Reply-To: " . $sender_email . "\r\n";
//	$headers .= "Return-Path: " . $sender_email; 
	
	mail('services@levyspools.com', $subject, $content, $headers);
	mail($sender_email, $subject, $content_for_sender, $headers);
	echo "Thank you for choosing Levy's Pools and Spas.  We will contact you at our earliest convenience.";
//	header( 'Location: http://www.levyspools.com/Services.html' ) ;
?>