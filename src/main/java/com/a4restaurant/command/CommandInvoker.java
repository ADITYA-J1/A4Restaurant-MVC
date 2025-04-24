package com.a4restaurant.command;

public class CommandInvoker {
    public void runCommand(OrderCommand command) {
        command.execute();
    }
}
