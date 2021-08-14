#!/usr/bin/node

const AgentsBuilder = require('../src/AgentsBuilder');

builder = new AgentsBuilder();

builder.setCachedDays(30);
builder.build();
// Or:
//builder.update();
//builder.parse();
