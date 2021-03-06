const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:  '602df53802023b7aa897bb24',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
            
                  url: 'https://res.cloudinary.com/dnbcdl2sx/image/upload/v1613981224/YelpCamp/ycnkr6rnq5hlfziilks5.jpg',
                  filename: 'YelpCamp/ycnkr6rnq5hlfziilks5'
                },
              
                {
                  url: 'https://res.cloudinary.com/dnbcdl2sx/image/upload/v1613981224/YelpCamp/w9g14ighnljjxdrjnmqu.jpg',
                  filename: 'YelpCamp/w9g14ighnljjxdrjnmqu'
                },
                {
          
                  url: 'https://res.cloudinary.com/dnbcdl2sx/image/upload/v1613981227/YelpCamp/jsykfuzzgvo07kckqzpw.jpg',
                  filename: 'YelpCamp/jsykfuzzgvo07kckqzpw'
                }
              ],
            
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry:{ coordinates:[
              cities[random1000].longitude,
              cities[random1000].latitude
          ],type: 'Point' },

        })
        
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})