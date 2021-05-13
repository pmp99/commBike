package es.upm.dit.isst.commBike.rest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import es.upm.dit.isst.commBike.dao.UserDAOImplementation;
import es.upm.dit.isst.commBike.dao.BikeDAOImplementation;
import es.upm.dit.isst.commBike.dao.RentalDAOImplementation;
import es.upm.dit.isst.commBike.model.User;
import es.upm.dit.isst.commBike.model.Bike;
import es.upm.dit.isst.commBike.model.Rental;

@Path("commBike")
public class CommBikeResource {

	@POST
	@Path("user/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> register (String data) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> dataMap = objectMapper.readValue(data, new TypeReference<Map<String, String>>() {});
		String email = dataMap.get("email");
		String password = dataMap.get("password");
		String password2 = dataMap.get("password2");
		String name = dataMap.get("name");
		return UserDAOImplementation.getInstance().register(name, email, password, password2);
	}

	@POST
	@Path("user/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Object login (String data) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> dataMap = objectMapper.readValue(data, new TypeReference<Map<String, String>>() {});
		String email = dataMap.get("email");
		String password = dataMap.get("password");
		return UserDAOImplementation.getInstance().login(email, password);
	}

	@PUT
	@Path("user/edit/{userId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User edit (String data, @PathParam("userId") int userId) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> dataMap = objectMapper.readValue(data, new TypeReference<Map<String, String>>() {});
		String name = dataMap.get("name");
		String email = dataMap.get("email");
		return UserDAOImplementation.getInstance().edit(userId, name, email);
	}

	@PUT
	@Path("user/password/{userId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> changePassword (String data, @PathParam("userId") int userId) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> dataMap = objectMapper.readValue(data, new TypeReference<Map<String, String>>() {});
		String oldPassword = dataMap.get("oldPassword");
		String newPassword = dataMap.get("newPassword");
		String newPassword2 = dataMap.get("newPassword2");
		return UserDAOImplementation.getInstance().changePassword(userId, oldPassword, newPassword, newPassword2);
	}


	@POST
	@Path("bike/newBikes")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public List<Bike> newBikes (String data) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, Double[][]> dataMap = objectMapper.readValue(data, new TypeReference<Map<String, Double[][]>>() {});
		Double[][] pos = dataMap.get("pos");
		return BikeDAOImplementation.getInstance().newBikes(pos);
	}

	@GET
	@Path("bike/getBike/{bikeId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Bike getBike(@PathParam("bikeId") int bikeId) {
		return BikeDAOImplementation.getInstance().getBike(bikeId);
	}


	@GET
	@Path("bike/getBikes")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Bike> getBikes() {
		return BikeDAOImplementation.getInstance().getBikes();
	}


	@PUT
	@Path("bike/toggleLockBike/{bikeId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> toggleLockBike (@PathParam("bikeId") int bikeId) {
		return BikeDAOImplementation.getInstance().toggleLockBike(bikeId);
	}

	@PUT
	@Path("bike/updatePos/{bikeId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Bike updatePosition (String data, @PathParam("bikeId") int bikeId) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, Double[]> dataMap = objectMapper.readValue(data, new TypeReference<Map<String, Double[]>>() {});
		Double[] pos = dataMap.get("pos");
		return BikeDAOImplementation.getInstance().updatePosition(bikeId, pos);
	}

	@POST
	@Path("rental/new")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Object newRental (String data) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> dataMap = objectMapper.readValue(data, new TypeReference<Map<String, String>>() {});
		int userId = Integer.parseInt(dataMap.get("userId"));
		String code = dataMap.get("code");
		return RentalDAOImplementation.getInstance().newRental(userId, code);
	}

	@GET
	@Path("rental/getRentals")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Rental> getRentals() {
		return RentalDAOImplementation.getInstance().getRentals();
	}

	@GET
	@Path("rental/getRentals/{userId}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Rental> getUserRentals(@PathParam("userId") int userId) {
		return RentalDAOImplementation.getInstance().getUserRentals(userId);
	}

	@PUT
	@Path("rental/finish/{rentalId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Rental finishRental (@PathParam("rentalId") int rentalId) {
		return RentalDAOImplementation.getInstance().finishRental(rentalId);
	}

	@PUT
	@Path("rental/updateRoute/{rentalId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Rental updateRoute (String data, @PathParam("rentalId") int rentalId) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> dataMap = objectMapper.readValue(data, new TypeReference<Map<String, String>>() {});
		String route = dataMap.get("route");
		return RentalDAOImplementation.getInstance().updateRoute(rentalId, route);
	}

	@GET
	@Path("rental/checkActiveRental/{userId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Rental checkActiveRental(@PathParam("userId") int userId) {
		return RentalDAOImplementation.getInstance().checkActiveRental(userId);
	}

}
