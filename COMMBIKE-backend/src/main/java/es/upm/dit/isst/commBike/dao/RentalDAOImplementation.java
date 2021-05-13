package es.upm.dit.isst.commBike.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;

import org.hibernate.Session;

import es.upm.dit.isst.commBike.model.Bike;
import es.upm.dit.isst.commBike.model.Rental;
import es.upm.dit.isst.commBike.model.User;

public class RentalDAOImplementation implements RentalDAO {
	private static  RentalDAOImplementation instancia = null;

	private RentalDAOImplementation() {

	}


	public static RentalDAOImplementation getInstance() {
		if( null == instancia )
			instancia = new RentalDAOImplementation();
		return instancia;
	}

	@Override
	public List<Rental> getRentals() {
		List<Rental> rentals = new ArrayList<Rental> ();
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		rentals.addAll(session.createQuery("from Rental").list());
		session.getTransaction().commit();
		session.close();
		return rentals;
	}

	@Override
	public List<Rental> getUserRentals(int userId) {
		List<Rental> rentals = new ArrayList<Rental> ();
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		rentals.addAll(session.createQuery("from Rental where userid=" + userId).list());
		session.getTransaction().commit();
		session.close();
		return rentals;
	}

	@Override
	public Rental updateRoute(int id, String route) {
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		Rental rental = session.get(Rental.class, id);
		session.getTransaction().commit();
		rental.setRoute(route);
		rental.setEnd(System.currentTimeMillis());
		session.beginTransaction();
		session.saveOrUpdate(rental);
		session.getTransaction().commit();
		session.close();
		return rental;
	}

	@Override
	public Rental checkActiveRental(int userId) {
		List<Rental> rentals = new ArrayList<Rental> ();
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		rentals.addAll(session.createQuery("from Rental where userid='" + userId + "' and price=null").list());
		session.getTransaction().commit();
		session.close();
		if (rentals.size() > 0) {
			return rentals.get(0);
		} else {
			return null;
		}
	}

	@Override
	public Rental finishRental(int id) {
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		Rental rental = session.get(Rental.class, id);
		session.getTransaction().commit();
		session.beginTransaction();
		Bike bike = session.get(Bike.class, rental.getBike().getId());
		session.getTransaction().commit();
		bike.setInUse(false);
		session.beginTransaction();
		session.saveOrUpdate(bike);
		session.getTransaction().commit();
		long end = System.currentTimeMillis();
		rental.setEnd(end);
		DecimalFormatSymbols formatSymbols = new DecimalFormatSymbols(Locale.getDefault());
		formatSymbols.setDecimalSeparator('.');
		DecimalFormat df = new DecimalFormat("###.##", formatSymbols);
		// PRECIO: 1€ + 0,25€/min
		Double price = Double.parseDouble(df.format((1 + 0.25 * (end - rental.getStart()) / 60000)));
		rental.setPrice(price);
		session.beginTransaction();
		session.saveOrUpdate(rental);
		session.getTransaction().commit();
		session.close();
		return rental;
	}

	@Override
	public Object newRental(int userId, String code) {
		List<Bike> bikes = new ArrayList<Bike> ();
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		bikes.addAll(session.createQuery("from Bike where code='" + code + "'").list());
		session.getTransaction().commit();
		if (bikes.size() > 0) {
			Bike bike = bikes.get(0);
			if (bike.isInUse() || bike.isLocked()) {
				return "ERROR";
			}
			bike.setInUse(true);
			session.beginTransaction();
			session.saveOrUpdate(bike);
			session.getTransaction().commit();
			String route = "[[" + bike.getLongitude() + ", " + bike.getLatitude() + "]]";
			Rental rental = new Rental();
			rental.setRoute(route);
			rental.setStart(System.currentTimeMillis());
			rental.setBike(bike);
			session.beginTransaction();
			User user = session.get(User.class, userId);
			session.getTransaction().commit();
			rental.setUser(user);
			session.beginTransaction();
			session.saveOrUpdate(rental);
			session.getTransaction().commit();
			session.close();
			return rental;
		} else {
			return false;
		}
	}
}
