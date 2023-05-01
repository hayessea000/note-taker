const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('public'));

const app = express();