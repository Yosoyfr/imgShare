$("#post-comment").hide();

$("#btn-toggle-comment").click(function (e) {
  e.preventDefault();
  $("#post-comment").slideToggle();
});

$("#btn-like").click(function (e) {
  e.preventDefault();
  let imageId = $(this).data("id");
  $.post("/images/" + imageId + "/like").done((data) => {
    $(".likes-count").text(data.likes);
  });
});

$("#btn-delete").click(function (e) {
  e.preventDefault();
  let $this = $(this);
  const response = confirm("Are you sure you want to delete this image?");
  if (response) {
    let imageId = $this.data("id");
    $.ajax({
      url: "/images/" + imageId,
      type: "DELETE",
    }).done(function (result) {
      $this.removeClass("btn-danger").addClass("btn-success");
      $this.find("i").removeClass("fa-time").addClass("fa-check");
      $this.append("<span>Deleted!</span>");
    });
  }
});
