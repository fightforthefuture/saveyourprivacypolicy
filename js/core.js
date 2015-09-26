(function (doc, win) {
  "use strict";

  function sendFormSubmission(e) {
    e.preventDefault();

    ga('send', 'event', 'petition', 'submit', 'Privacy Policy Submission', doc.getElementById('startup').checked ? 1 : 0);
    doc.forms.actionform.submit();
  }

  doc.getElementById('actionbutton').addEventListener('click', sendFormSubmission);
})(document, window);

//# sourceMappingURL=core.js.map