package com.SFAE.SFAE.ENDPOINTS;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import com.SFAE.SFAE.ENTITY.Worker;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

/**
 * @author Levent
 */
public interface WorkerEPDoc {
  
   static final String api_group_worker = "Worker endpoint";

    /**
     * Return all Workers.
     * 
     * - GET /Workers
     * 
     * @return iterable with all Workers.
     */
    @Operation(
        // group name where this operation appears and defines swagger tag
        // http://localhost:8080/swagger-ui/index.html#/workers-controller
        tags = {api_group_worker},

        // summary: single-line description in API short-list
        summary = "Return all workers.",

        // detailed description inside API
        description = "Return all workers (no limit, no pagination)."
    )
    @ApiResponses(value={
        @ApiResponse(responseCode="200", description="OK", content=@Content(mediaType="application/json")),
    })
    //
    Iterable<Worker> findAllWorker();


     /**
     * Return Worker by id.
     * 
     * - GET /Worker/{id}
     * 
     * @param id of Worker, id must not be negative.
     * @return Worker with id.
     * @throws ResponseStatusException 400 bad request, 404 not found.
     */
    @Operation(
        tags = {api_group_worker},
        summary = "Return Worker by id, id must not be negative.",
        description = "Return Worker if id exists, else return error 404 (not found)."
        // parameters = {@Parameter(name="id", in=ParameterIn.QUERY, schema=@Schema(implementation=Long.class)) }
    )
    @ApiResponses(value={
        @ApiResponse(responseCode="200", description="OK", content=@Content(mediaType="application/json")),
        @ApiResponse(responseCode="400", description="Bad Request"),
        @ApiResponse(responseCode="404", description="Not Found"),
    })
    //
     Optional<Worker> findWorkersbyID(long id);

      /**
     * Return Worker by id.
     * 
     * - GET /Worker/{id}
     * 
     * @param id of Worker, id must not be negative.
     * @return Worker with id.
     * @throws ResponseStatusException 400 bad request, 404 not found.
     */
    @Operation(
        tags = {api_group_worker},
        summary = "Return worker by Name, Name must not be empty.",
        description = "Return worker if Name exists, else return error 404 (not found)."
        // parameters = {@Parameter(name="id", in=ParameterIn.QUERY, schema=@Schema(implementation=Long.class)) }
    )
    @ApiResponses(value={
        @ApiResponse(responseCode="200", description="OK", content=@Content(mediaType="application/json")),
        @ApiResponse(responseCode="400", description="Bad Request"),
        @ApiResponse(responseCode="404", description="Not Found"),
    })
    //
    Worker findWorkerByName(@PathVariable String Name);


      /**
     * Create new Woker in database from JSON data received in Request-Body.
     * 
     * - POST /worker
     * 
     * Method receives JSON data as Map<key,attr> as parameter. Atributes are
     * validated, in particular the id-value, which MUST be missing or empty
     * since it is assigned by the database.
     * 
     * If all attributes are valid, the Worker object is created and added to
     * the database.
     * 
     * @param jsonData serialized JSON received with the Request.
     * @return ResponseEntity with serialized worker object and status code.
     * @throws ResponseStatusException 400 bad request, 409 conflict (worker present).
     */
    @Operation(
        tags = {api_group_worker},
        summary = "Create new Worker, Worker id must not exist.",
        description = "Create new Worker from JSON data received in the Request-Body."
    )
    @RequestBody(
        description = "JSON data from which Worker object to create is deserialized.",
        required = true,
        content = @Content(
            // https://stackoverflow.com/questions/63465763/springdoc-openapi-how-to-add-example-of-post-request
            schema = @Schema(implementation=Worker.class),
            mediaType = MediaType.APPLICATION_JSON_VALUE,
            examples = {
                @ExampleObject(
                    name = "An example request with the minimum required fields to create.",
                    value = "min",
                    summary = "Minimal request"),
                @ExampleObject(
                    name = "An example request with all fields provided with example values.",
                    value = "full",
                    summary = "Full request")
            }
        )
    )
    @ApiResponses(value={
        @ApiResponse(responseCode="201", description="Created"),
        @ApiResponse(responseCode="400", description="Bad Request"),
        @ApiResponse(responseCode="409", description="Conflict"),
    })
    //
    ResponseEntity<Worker> createWorker(@RequestBody Map<String, Object> jsonData);

     /**
     * Update existing CusWorkertomer in database from JSON data received in Request-Body.
     * 
     * - PUT /Worker
     * 
     * Method receives JSON data as Map<key,attr> as parameter. Atributes are
     * validated, in particular the id-value, which MUST must exist in the
     * database in order to update the corresponding database object.
     * 
     * @param jsonData serialized JSON received with the Request.
     * @return empty ResponseEntity with status code.
     * @throws ResponseStatusException 400 bad request, 404 conflict (not found).
     */
    @Operation(
        tags = {api_group_worker},
        summary = "Create new Worker, Worker id must not exist.",
        description = "Create new Worker from JSON data received in the Request-Body."
    )
    @RequestBody(
        description = "JSON data from which Worker object to update is deserialized.",
        required = true
    )
    @ApiResponses(value={
        @ApiResponse(responseCode="202", description="Accepted"),
        @ApiResponse(responseCode="400", description="Bad Request"),
        @ApiResponse(responseCode="404", description="Not Found"),
    })
    //
    ResponseEntity<?> updateWorker(@RequestBody Map<String, Object> jsonData);


      /**
     * Delete Worker with id from database.
     * 
     * - DELETE /Worker/{id}
     * 
     * @param id of Worker, id must exist.
     * @return empty ResponseEntity with status code.
     * @throws ResponseStatusException 400 bad request, 404 not found, 409 conflict.
     */
    @Operation(
        tags = {api_group_worker},
        summary = "Delete Worker with id from database, id must exist.",
        description = "Delete Worker with id from database. If id is not found, " +
            "return error 404 (not found). If Worker cannot be deleted due to " +
            "foreign key dependencies, return error 409 (conflict)."
    )
    
    @ApiResponses(value={
        @ApiResponse(responseCode="202", description="Accepted"),
        @ApiResponse(responseCode="400", description="Bad Request"),
        @ApiResponse(responseCode="404", description="Not Found"),
        @ApiResponse(responseCode="409", description="Conflict"),
    })
    //
    ResponseEntity<?> deleteWorkerById(@PathVariable long id);
    
}
