package es.upm.dit.isst.commBike.dao;

import java.util.Map;

import es.upm.dit.isst.commBike.model.User;

public interface UserDAO {
	public Map<String, Object> register(String name, String email, String password, String password2);
	public Object login(String email, String password);
	public User edit(int id, String name, String email);
	public Map<String, Object> changePassword(int id, String oldPassword, String newPassword, String newPassword2);
}
