package es.upm.dit.isst.commBike.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;

import es.upm.dit.isst.commBike.model.Bike;

public class BikeDAOImplementation implements BikeDAO {
	private static  BikeDAOImplementation instancia = null;

	private BikeDAOImplementation() {

	}


	public static BikeDAOImplementation getInstance() {
		if( null == instancia )
			instancia = new BikeDAOImplementation();
		return instancia;
	}

	@Override
	public Bike getBike(int id) {
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		Bike bike = session.get(Bike.class, id);
		session.getTransaction().commit();
		session.close();
		return bike;
	}

	@Override
	public List<Bike> getBikes() {
		List<Bike> bikes = new ArrayList<Bike> ();
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		bikes.addAll(session.createQuery("from Bike").list());
		session.getTransaction().commit();
		session.close();
		return bikes;
	}

	@Override
	public List<Bike> newBikes(Double[][] pos) {
		Session session = SessionFactoryService.get().openSession();
		for (Double[] position : pos) {
			Double longitude = position[0];
			Double latitude = position[1];
			String code = "";
			boolean codeExists = false;
			do {
				codeExists = false;
				code = Integer.toString((int)Math.floor(Math.random()*10000));
				List<Bike> bikes = new ArrayList<Bike> ();
				bikes.addAll(session.createQuery("from Bike where code='" + code + "'").list());
				if (bikes.size() > 0) {
					codeExists = true;
				}
			} while (codeExists);
			Bike bike = new Bike();
			bike.setLatitude(latitude);
			bike.setLongitude(longitude);
			bike.setCode(code);
			session.beginTransaction();
			session.save(bike);
			session.getTransaction().commit();
		}
		List<Bike> bikes = new ArrayList<Bike> ();
		session.beginTransaction();
		bikes.addAll(session.createQuery("from Bike").list());
		session.getTransaction().commit();
		session.close();
		return bikes;
	}

	@Override
	public Map<String, Object> toggleLockBike(int id) {
		Map<String, Object> object = new HashMap<String, Object>();
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		Bike bike = session.get(Bike.class, id);
		session.getTransaction().commit();
		boolean locked = bike.isLocked();
		bike.setLocked(!locked);
		session.beginTransaction();
		session.saveOrUpdate(bike);
		session.getTransaction().commit();
		List<Bike> bikes = new ArrayList<Bike> ();
		session.beginTransaction();
		bikes.addAll(session.createQuery("from Bike").list());
		session.getTransaction().commit();
		session.close();
		object.put("bikes", bikes);
		object.put("bike", bike);
		return object;
	}

	@Override
	public Bike updatePosition(int id, Double[] pos) {
		Session session = SessionFactoryService.get().openSession();
		session.beginTransaction();
		Bike bike = session.get(Bike.class, id);
		session.getTransaction().commit();
		bike.setLongitude(pos[0]);
		bike.setLatitude(pos[1]);
		session.beginTransaction();
		session.saveOrUpdate(bike);
		session.getTransaction().commit();
		session.close();
		return bike;
	}

}
