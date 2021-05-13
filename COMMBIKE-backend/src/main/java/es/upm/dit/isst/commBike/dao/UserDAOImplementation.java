package es.upm.dit.isst.commBike.dao;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;

import es.upm.dit.isst.commBike.model.User;

public class UserDAOImplementation implements UserDAO {
	private static  UserDAOImplementation instancia = null;

	private UserDAOImplementation() {

	}


	public static UserDAOImplementation getInstance() {
		if( null == instancia )
			instancia = new UserDAOImplementation();
		return instancia;
	}

	@Override
	public Map<String, Object> register(String name, String email, String password, String password2) {
		Map<String, Object> object = new HashMap<String, Object>();
		if (!password.equals(password2)) {
			object.put("success", false);
			object.put("data", "Las contraseñas no coinciden");
			return object;
		}
		List<User> users = new ArrayList<User> ();
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		users.addAll(session.createQuery("from User where email='" + email + "'").list());
		session.getTransaction().commit();
		if (users.size() > 0) {
			object.put("success", false);
			object.put("data", "El correo electrónico ya está en uso");
			return object;
		} else {
			User user = new User();
			user.setName(name);
			user.setEmail(email);
			try {
				user.setPassword(password);
			} catch (NoSuchAlgorithmException e) {
				return null;
			} catch (InvalidKeySpecException e) {
				return null;
			}
			session.beginTransaction();
			session.save(user);
			session.getTransaction().commit();
			session.close();
			object.put("success", true);
			object.put("data", user);
			return object;
		}
	}

	@Override
	public Object login(String email, String password) {
		List<User> users = new ArrayList<User> ();
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		users.addAll(session.createQuery("from User where email='" + email + "'").list());
		session.getTransaction().commit();
		session.close();
		if (users.size() > 0) {
			User user = users.get(0);
			boolean correct = false;
			try {
				correct = user.verifyPassword(password);
			} catch (NoSuchAlgorithmException e) {
				return false;
			} catch (InvalidKeySpecException e) {
				return false;
			}
			if (correct) {
				return user;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	@Override
	public User edit(int id, String name, String email) {
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		User user = session.get(User.class, id);
		user.setName(name);
		user.setEmail(email);
		session.saveOrUpdate(user);
		session.getTransaction().commit();
		session.close();
		return user;
	}

	@Override
	public Map<String, Object> changePassword(int id, String oldPassword, String newPassword, String newPassword2) {
		Map<String, Object> object = new HashMap<String, Object>();
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		User user = session.get(User.class, id);
		session.getTransaction().commit();
		boolean correct = false;
		try {
			correct = user.verifyPassword(oldPassword);
		} catch (NoSuchAlgorithmException e1) {
			return null;
		} catch (InvalidKeySpecException e1) {
			return null;
		}
		if (correct) {
			if (newPassword.equals(newPassword2)) {
				try {
					user.setPassword(newPassword);
					session.beginTransaction();
					session.saveOrUpdate(user);
					session.getTransaction().commit();
				} catch (NoSuchAlgorithmException e) {
					return null;
				} catch (InvalidKeySpecException e) {
					return null;
				}
			} else {
				object.put("success", false);
				object.put("data", "Las contraseñas no coinciden");
				return object;
			}
		} else {
			object.put("success", false);
			object.put("data", "Contraseña incorrecta");
			return object;
		}
		session.close();
		object.put("success", true);
		object.put("data", user);
		return object;
	}

}
