// import React from "react";

// const Shared = ({ lang }) => {
//   return <span className="icon-like">Like</span>;
// };

// export default Shared;

// import React, { useState } from "react";
// import { Dropdown, Toast, ToastContainer } from "react-bootstrap";

// const ShareDropdown = ({ url, text }: { url: string, text: string }) => {
//   const [showToast, setShowToast] = useState(false);

//   const copyToClipboard = async () => {
//     await navigator.clipboard.writeText(url);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 2000);
//   };

//   const shareX = () => {
//     const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
//       text
//     )}&url=${encodeURIComponent(url)}`;
//     window.open(xUrl, "_blank", "width=600,height=400");
//   };

//   const shareFB = () => {
//     const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//       url
//     )}`;
//     window.open(fbUrl, "_blank", "width=600,height=400");
//   };

//   return (
//     <>
//       <Dropdown className="d-none d-sm-block">
//         <Dropdown.Toggle variant="link" className="p-0 text-decoration-none">
//           <i className="bi bi-share-fill text-primary"></i>
//         </Dropdown.Toggle>

//         <Dropdown.Menu align="end">
//           <Dropdown.Item onClick={copyToClipboard}>
//             <i className="bi bi-clipboard me-2"></i> {lang.copy_link}
//           </Dropdown.Item>
//           <Dropdown.Item onClick={shareX}>
//             <i className="bi bi-twitter-x me-2"></i> Share on X
//           </Dropdown.Item>
//           <Dropdown.Item onClick={shareFB}>
//             <i className="bi bi-facebook me-2"></i> Share on Facebook
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>

//       <ToastContainer position="bottom-end" className="p-3">
//         <Toast show={showToast} onClose={() => setShowToast(false)}>
//           <Toast.Body>Посилання скопійовано!</Toast.Body>
//         </Toast>
//       </ToastContainer>
//     </>
//   );
// };

import React, { useState } from "react";
import { Dropdown, Toast, ToastContainer } from "react-bootstrap";

const ShareDropdown = ({ url, text, lang }) => {
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const shareX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, "_blank", "width=600,height=400");
  };

  const shareFB = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  return (
    <>
      <Dropdown className="d-none d-sm-block">
        <Dropdown.Toggle variant="link" className="p-0 text-decoration-none">
          <i className="bi bi-share-fill text-primary"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Item onClick={copyToClipboard}>
            <i className="bi bi-clipboard me-2"></i> {lang.copy_link}
          </Dropdown.Item>
          <Dropdown.Item onClick={shareX}>
            <i className="bi bi-twitter-x me-2"></i> X
          </Dropdown.Item>
          <Dropdown.Item onClick={shareFB}>
            <i className="bi bi-facebook me-2"></i> Facebook
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)}>
          <Toast.Body>Посилання скопійовано!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default ShareDropdown;
