package es.upm.dit.isst.commBike.dao;

import java.util.List;
import java.util.Map;

import es.upm.dit.isst.commBike.model.Bike;

public interface BikeDAO {
	public Bike getBike(int id);
	public List<Bike> getBikes();
	public List<Bike> newBikes(Double[][] pos);
	public Map<String, Object> toggleLockBike(int id);
	public Bike updatePosition(int id, Double[] pos);
}
