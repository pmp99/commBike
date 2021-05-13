package es.upm.dit.isst.commBike.dao;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import es.upm.dit.isst.commBike.model.Bike;

class BikeDAOImplementationTest {

	@Test
	void testBike() {
		BikeDAO bikeDAO = BikeDAOImplementation.getInstance();
		
		List<Bike> answer = bikeDAO.newBikes(new Double[][]{{3.1, 4.2}, {5.8, 9.4}, {6.0, 0.7}, {3.5, 1.2}, {9.8, 2.3}});
		assertEquals(answer.size(), 5);
		
		Bike answer2 = bikeDAO.getBike(1);
		assertTrue(answer2.getClass().equals(Bike.class));
		
		answer = bikeDAO.getBikes();
		assertEquals(answer.size(), 5);
		
		Map<String, Object> answer3 = bikeDAO.toggleLockBike(1);
		assertTrue(Bike.class.cast(answer3.get("bike")).isLocked());
		answer3 = bikeDAO.toggleLockBike(1);
		assertFalse(Bike.class.cast(answer3.get("bike")).isLocked());
		answer3 = bikeDAO.toggleLockBike(1);
		assertTrue(Bike.class.cast(answer3.get("bike")).isLocked());
		
		answer2 = bikeDAO.updatePosition(1, new Double[]{1.0, 1.0});
		assertEquals(answer2.getLatitude(), 1.0);
		assertEquals(answer2.getLongitude(), 1.0);
	}

}
