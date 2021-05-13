package es.upm.dit.isst.commBike.dao;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;

import es.upm.dit.isst.commBike.model.Bike;
import es.upm.dit.isst.commBike.model.Rental;

class RentalDAOImplementationTest {

	@Test
	void testRentals() {
		RentalDAO rentalDAO = RentalDAOImplementation.getInstance();
		UserDAO userDAO = UserDAOImplementation.getInstance();
		BikeDAO bikeDAO = BikeDAOImplementation.getInstance();
		
		userDAO.register("email1", "name1", "1234", "1234");
		List<Bike> bikes = bikeDAO.newBikes(new Double[][]{{3.1, 4.2}, {5.8, 9.4}});
		String errorcode = "aaa";
		
		Object answer = rentalDAO.newRental(1, errorcode);
		assertFalse((boolean) answer);
		
		bikeDAO.toggleLockBike(bikes.get(0).getId());
		answer = rentalDAO.newRental(1, bikes.get(0).getCode());
		assertEquals((String) answer, "ERROR");
		bikeDAO.toggleLockBike(bikes.get(0).getId());
		
		Rental rental = Rental.class.cast(rentalDAO.newRental(1, bikes.get(0).getCode()));
		assertEquals(rental.getRoute(), "[[3.1, 4.2]]");
		assertNull(rental.getPrice());
		assertEquals(rental.getEnd(), 0);
		
		List<Rental> answer2 = rentalDAO.getRentals();
		assertEquals(answer2.size(), 1);
		
		answer2 = rentalDAO.getUserRentals(1);
		assertEquals(answer2.size(), 1);
		
		answer2 = rentalDAO.getUserRentals(2);
		assertEquals(answer2.size(), 0);
		
		String route = "[[1, 1], [2, 2], [3, 3]";
		rental = rentalDAO.updateRoute(rental.getId(), route);
		assertEquals(rental.getRoute(), route);
		assertNull(rental.getPrice());
		
		rental = rentalDAO.finishRental(rental.getId());
		assertNotNull(rental.getPrice());
		assertFalse(rental.getBike().isInUse());
	}

}
