package es.upm.dit.isst.commBike.rest;

import javax.ws.rs.ApplicationPath;

import org.glassfish.jersey.server.ResourceConfig;

@ApplicationPath("rest")
public class CommBikeApp extends ResourceConfig {

	public CommBikeApp() {
		packages("es.upm.dit.isst.commBike.rest");
	}

}
