package com.SFAE.SFAE.Service;

import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    private final Set<String> users = Collections.synchronizedSet(new HashSet<>());

    private final SimpMessageSendingOperations messageTemplate;

    public void addUser(String username) {
        users.add(username);
        broadcastUserList();
    }

    public void removeUser(String username) {
        users.remove(username);
        broadcastUserList();
    }

    public Set<String> getUsers() {
        return users;
    }

    private void broadcastUserList() {
        // send the list to all connected clients
        messageTemplate.convertAndSend("/topic/users", new ArrayList<>(users));
    }
}