package com.SFAE.SFAE.Service;

import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Service class for managing connected users in a WebSocket-based chat application.
 * @author erayzor
 */
@Service
@RequiredArgsConstructor
public class UserService {
    private final Set<String> users = Collections.synchronizedSet(new HashSet<>());

    private final SimpMessageSendingOperations messageTemplate;

    /**
     * Adds a user to the set of connected users and broadcasts the updated user list.
     * 
     * @param username The username of the user to be added.
     */
    public void addUser(String username) {
        users.add(username);
        broadcastUserList();
    }

    /**
     * Removes a user from the set of connected users and broadcasts the updated user list.
     * 
     * @param username The username of the user to be removed.
     */
    public void removeUser(String username) {
        users.remove(username);
        broadcastUserList();
    }

    /**
     * Retrieves the set of connected users.
     * 
     * @return A set containing the usernames of all connected users.
     */
    public Set<String> getUsers() {
        return users;
    }

    /**
     * Broadcasts the list of connected users to all subscribed clients.
     */
    private void broadcastUserList() {
        // send the list to all connected clients
        messageTemplate.convertAndSend("/topic/users", new ArrayList<>(users));
    }
}