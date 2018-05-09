(function($) {

  let cartArea = $("#cart");
  const bookList = $(".people_list");
  function bindEventsToTodoItem(item) {
    item.find(".add_to_cart").on("click", function(event) {
      event.preventDefault();
      const currentLink = $(this);
      const currentId = currentLink.data("id");
      const requestConfig = {
        method: "GET",
        url: "/cart/" + currentId
      };

      $.ajax(requestConfig).then(function(responseMessage) {
        console.log(responseMessage);
        if (responseMessage == 'Fail') {
          alert("Please Log In!");
        } else {
          const newElement = $(responseMessage);
          cartArea.replaceWith(newElement);
          cartArea = $("#cart");
        }
      });
    });
  }

  bookList.children().each(function(index, element) {
    bindEventsToTodoItem($(element));
  });
})(window.jQuery);
