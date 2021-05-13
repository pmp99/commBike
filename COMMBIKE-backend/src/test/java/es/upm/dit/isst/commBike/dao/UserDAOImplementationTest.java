package es.upm.dit.isst.commBike.dao;

import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;

import es.upm.dit.isst.commBike.model.User;

class UserDAOImplementationTest {

	@Test
	void testUser() {
		UserDAO userDAO = UserDAOImplementation.getInstance();
		
		Object answer = userDAO.register("email1", "name1", "1234", "12345");
		Map<String, Object> expected = new HashMap<String, Object>() {{
	        put("success", false);
	        put("data", "Las contraseñas no coinciden");
	    }};
		assertEquals(answer, expected);
		
		answer = userDAO.register("email1", "name1", "1234", "1234");
		
		answer = userDAO.register("email1", "name1", "1234", "1234");
		expected = new HashMap<String, Object>() {{
	        put("success", false);
	        put("data", "El correo electrónico ya está en uso");
	    }};
		assertEquals(answer, expected);
		
		answer = userDAO.register("email1", "name1", "1234", "1234");
		answer = userDAO.login("email1", "12345");
		assertFalse((boolean) answer);
		answer = userDAO.login("email2", "1234");
		assertFalse((boolean) answer);
		
		User answer2 = userDAO.edit(1, "name2", "email2");
		assertEquals(answer2.getName(), "name2");
		
		answer = userDAO.changePassword(1, "1234", "123456", "12345");
		expected = new HashMap<String, Object>() {{
	        put("success", false);
	        put("data", "Las contraseñas no coinciden");
	    }};
		assertEquals(answer, expected);
		
		answer = userDAO.changePassword(1, "123456", "12345", "12345");
		expected = new HashMap<String, Object>() {{
	        put("success", false);
	        put("data", "Contraseña incorrecta");
	    }};
		assertEquals(answer, expected);
		
		Map<String, Object> answer3 = userDAO.changePassword(1, "1234", "12345", "12345");
		assertTrue(answer3.get("data").getClass().equals(User.class));
	}

}
