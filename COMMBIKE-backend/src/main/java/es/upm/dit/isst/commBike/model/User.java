package es.upm.dit.isst.commBike.model;

import java.io.Serializable;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.MessageDigest;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import java.nio.charset.StandardCharsets;



@Entity
public class User implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	private String name;
	private String email;
	private byte[] password;
	private byte[] salt;
	private boolean admin;

	public User() {
		admin = false;
	}


	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public byte[] getPassword() {
		return password;
	}

	public void setPassword(String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		//Generate the salt
		SecureRandom random = new SecureRandom();
		byte[] salt = new byte[16];
		random.nextBytes(salt);
		this.salt = salt;
		md.update(salt);
		//Gerenate the hash
		byte[] hashedPassword = md.digest(password.getBytes(StandardCharsets.UTF_8));
		this.password = hashedPassword;
	}

	public boolean verifyPassword(String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		md.update(this.salt);
		byte[] hashedPassword = md.digest(password.getBytes(StandardCharsets.UTF_8));
		String oldHash = new String(this.password, StandardCharsets.UTF_8);
		String newHash = new String(hashedPassword, StandardCharsets.UTF_8);
		return (oldHash.equals(newHash));
	}

	public byte[] getSalt() {
		return salt;
	}

	public void setSalt(byte[] salt) {
		this.salt = salt;
	}

	public boolean isAdmin() {
		return admin;
	}

	public void setAdmin(boolean admin) {
		this.admin = admin;
	}
	

}
