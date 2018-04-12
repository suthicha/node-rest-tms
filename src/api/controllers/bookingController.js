const helper = require('../utils/helper');
const Booking = require('../adapters/bookingAdapter');
const NAME = "bookingController";

exports.get_booking_by_invoiceno = (req, res, next) => {
    try {
        const invoiceno = req.params.invoiceno.replace('&sol;','/');
        Booking.get_booking_by_invoiceno(invoiceno, (data, error)=> {
            if(error){
                helper.sendJson(req, res, 501, NAME, {
                    message: "Internal Server Error"
                })
            }else{
                helper.sendJson(req, res, 200, NAME, {
                    invoiceno: invoiceno,
                    bookings: data
                })
            }
        });

    }catch(e){
        helper.sendJson(req, res, 500, NAME, {
            message: e.message
        });
    }
};