// icons
import { IoIosMail } from "react-icons/io";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaFax } from "react-icons/fa";
``;
import { SiGooglemaps } from "react-icons/si";

const Zynnn = {
  email: "Zynnn25@gmail.com",
  phone_number: "08123456789",
  fax: "+62(021)-1234567",
  address:
    "Jl.Cilibang, Notog, Patikraja, Banyumas Regency, Central Java, Indonesia",
};

const Maps = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 p-5 gap-10">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12314.460640763122!2d109.2190920682872!3d-7.491543279884117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1747112023457!5m2!1sen!2sid"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="maps"
      />
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="h-4 w-1 bg-[var(--primary-color)] rounded-md mt-2"></div>
          <h2 className="text-2xl font-bold">Zynn News Information</h2>
        </div>
        <div className="flex gap-2">
          <div className="h-60 w-1 bg-gray-300 rounded-md "></div>
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-4">
              <IoIosMail className="w-6 h-6 text-gray-500" />
              <p>Email:{Zynnn.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <IoPhonePortraitOutline className="w-5 h-5 text-gray-500" />
              <p>Phone Number:{Zynnn.phone_number}</p>
            </div>
            <div className="flex items-center gap-4">
              <FaFax className="w-5 h-5 text-gray-500" />
              <p>Fax: {Zynnn.fax}</p>
            </div>
            <div className="flex items-center gap-4">
              <SiGooglemaps className="w-5 h-5 text-gray-500" />
              <p>Address:{Zynnn.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;
