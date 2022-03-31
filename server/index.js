const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 5000;
const fs = require('fs');

server.listen(port, ()=>{
    console.log(`Server listening to port ${port}`);
});

io.on('connection', socket=>{
    console.log(`Client connected: ${socket.id}`);

    socket.on('getSampleTicketData', ()=>{
        console.log('Send sample ticket data');
        const TICKET_DATA = fs.readFileSync('./Sample_Tickets.csv', {encoding:'utf8', flag:'r'});
        io.emit('getSampleTicketData', {
            TICKET_DATA: TICKET_DATA,
        });
    });

    socket.on('getSubsidiary1SupportTicketData', ()=>{
        console.log('Send ticket data');
        const TICKET_DATA = fs.readFileSync('./Subsidiary1_Support_Tickets.csv', {encoding:'utf8', flag:'r'});
        io.emit('getSubsidiary1SupportTicketData', {
            TICKET_DATA: TICKET_DATA,
            category: 'Subsidiary 1 Support',
        });
    });
});

