import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">
      <h2>Liên hệ với chúng tôi</h2>

      <div className="contact-content">
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="name">Họ và tên:</label>
          <input type="text" id="name" name="name" placeholder="Nhập họ tên của bạn" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Nhập địa chỉ email" required />

          <label htmlFor="message">Nội dung:</label>
          <textarea id="message" name="message" rows={5} placeholder="Nhập tin nhắn..." required></textarea>

          <button type="submit" className="btn-submit">Gửi liên hệ</button>
        </form>

        <div className="contact-info">
          <h4>Thông tin liên hệ</h4>
          <p>Email: support@myshop.com</p>
          <p>Hotline: 0123 456 789</p>
          <p>Địa chỉ: Hà Nội</p>
        </div>
      </div>
    </div>
  );
}
