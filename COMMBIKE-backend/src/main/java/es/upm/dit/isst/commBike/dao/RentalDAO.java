package es.upm.dit.isst.commBike.dao;

import java.util.List;

import es.upm.dit.isst.commBike.model.Rental;

public interface RentalDAO {
	public List<Rental> getRentals();
	public List<Rental> getUserRentals(int userId);
	public Rental updateRoute(int id, String route);
	public Rental checkActiveRental(int userId);
	public Rental finishRental(int id);
	public Object newRental(int userId, String code);
}
