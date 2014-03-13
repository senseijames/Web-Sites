<?php
/*
	url_variables.sender_name = name_field.text;
	url_variables.sender_email = email_address_field.text;
	url_variables.subject = subject_field.text;
	url_variables.content = message_field.text;
*/

	$sender_name = $_POST['sender_name'];
	$sender_email = $_POST['sender_email'];
	$subject = $_POST['message_subject'];
	
	
	$content = "A new message from deNovoca.com, sent by " . $sender_name . " from email address " . $sender_email . " reads:<br/><br/>";
	$content .= $_POST['message_content'];
	
	$content_for_sender = "You have sent the following email via deNovoca.com; here is a copy for your records:<br/><br/>";
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
	$headers .= "From: deNovoca.com " . $sender_name . "<" . $sender_email . ">\r\n";
//	$headers .= "Reply-To: " . $sender_email . "\r\n";
//	$headers .= "Return-Path: " . $sender_email; 
	
	mail('contact@denovoca.com', $subject, $content, $headers);
	mail($sender_email, $subject, $content_for_sender, $headers);
?>