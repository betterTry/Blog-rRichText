(function() {
  reqwest({
    url: '/write/init',
    success: function(result) {
      if (result.success) {
        var data = result.data;
        if (data.length) {
          var worksNav = document.querySelector('.worksNav');
          var fragment = document.createDocumentFragment();
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var workTag = document.querySelector('.workTag').cloneNode();
            workTag.textContent = item.name;
            fragment.appendChild(workTag);
            workTag = null;
          }
          worksNav.appendChild(fragment);
          worksNav = null;
        }
      }
    },
  });

})();
