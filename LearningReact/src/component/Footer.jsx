import "../stylesheet/Style.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__logo">
          <h4>Hotel Shrestha</h4>
        </div>

        <div className="footer__contact">
          <p>Phone: +123 456 789</p>
          <p>Email: contact@hotelshrestha.com</p>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; 2024 Hotel Shrestha. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
