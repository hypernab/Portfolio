$(document).ready(function() {

 // Variable to track whether colors are currently inverted
let colorsInverted = false;

// Function to invert the colors of the page
function invertColors() {
  if (!colorsInverted) {
    // Add CSS rules to invert colors
    document.body.style.filter = "invert(1)";
    colorsInverted = true;
  } else {
    // Reset to normal colors
    document.body.style.filter = "none";
    colorsInverted = false;
  }
}

// Use setInterval to run the invertColors function every 10 seconds (reminder for later to add a switch btw)
setInterval(invertColors, 10000);

  $(".right textarea").val($(".left textarea").val());
  $(".right textarea").caret(0);

  // autosize the textareas
  $("textarea").autosize();

  // reverse the arrow keys on the left side
  $(".left textarea").on("keydown", function(event) {

    // move the caret to the right if the left key was pressed
    if (event.which === 37) {
      var caretPosition = $(this).caret();
      $(this).caret(caretPosition + 1);
    }

    // move the caret to the left if the right key was pressed
    else if (event.which === 39) {
      var caretPosition = $(this).caret();
      
      if (caretPosition > 0)
        $(this).caret(caretPosition - 1);
    }
    
    else {
      return;
    }

    event.preventDefault();
  });

  // set up the textarea mirroring
  $("textarea").on("change input", function() {

    var opposite = $(this).parent().hasClass("left") ? $(".right textarea") : $(".left textarea");

    // replace the text on the opposite side and trigger autosize
    opposite.val($(this).val());
    $("textarea").trigger('autosize.resize');
  });

  // resize the textareas when mobile devices change orientation
  $(window).bind("orientationchange", function() {
    $("textarea").trigger('autosize.resize');
  });
});


// https://github.com/LandonSchropp/caret/blob/master/jquery.caret.js
(function($, document) {
  "use strict";

  /*
  Returns the position of the caret.
  */
  var getCaretPosition = function() {

    // return null unless this element is focused
    if (!this.is(":focus"))
      return null;

    // return null if no elements are contained within this jQuery object
    if (this.length === 0)
      return null;

    // return 0 if the element is empty
    if (this.val().length === 0)
      return 0;

    var element = this.get(0);

    // The following implementation is based on: http://stackoverflow.com/a/3373056/262125

    // get the caret position for modern browsers
    if (typeof element.selectionStart === "number")
      return element.selectionStart;

    // return 0 when in IE and the textarea is empty
    var range = document.selection.createRange();

    if (!range || range.parentElement() !== element)
      return 0;

    // normalize the windows newlines
    var normalizedValue = element.value.replace(/\r\n/g, "\n");
    var length = element.value.length;

    // create a range for the element
    var elementRange = element.createTextRange();
    elementRange.moveToBookmark(range.getBookmark());

    // Check if the start and end of the selection are at the very end of the input, since 
    // moveStart/moveEnd doesn't return what we want in those cases
    var endRange = element.createTextRange();
    endRange.collapse(false);

    if (elementRange.compareEndPoints("StartToEnd", endRange) > -1) 
      return normalizedValue.length;

    var start = -elementRange.moveStart("character", -length);

    return start;
  };

  /*
  Sets the position of the caret.
  position - The position of the caret to set. If this value is less than 0 or greater than this
  element's length, the value will be clamped.
  */
  var setCaretPosition = function(position) {

    // focus this element if it wasn't already focused
    if (!this.is(":focus"))
      this.focus();

    // clamp the position value
    if (position < 0)
      position = 0;

    if (position > this.val().length)
      position = this.val().length;

    // return this if no elements are contained within this jQuery object
    if (this.length === 0)
      return this;

    var element = this.get(0);

    /*
    This implementation was taken from: http://stackoverflow.com/a/499158/262125
    */
    if (element.setSelectionRange) {
      element.focus();
      element.setSelectionRange(position, position);
    }
    else if (element.createTextRange) {
      var range = element.createTextRange();
      range.collapse(true);
      range.moveEnd('character', position);
      range.moveStart('character', position);
      range.select();
    }

    return this;
  };

  /*
  This method accepts calls of the following forms:

  $(element).caret(): Returns the current position of the caret for this jQuery object. If this 
  jQuery does not contain any elements, or if the first element in this jQuery object is not 
  selected, this method returns null.

  $(element).caret(position): Sets the position of the caret for this jQuery object.
  position - The new position of the caret. If this value is less than 0 or greater than the length
  of the content of this HTML element, it will be clamped.
  */
  $.fn.caret = function(position) {

    // determine if the position was provided
    if (typeof position === "number") {
      return setCaretPosition.apply(this, [ position ]);
    }
    else {
      return getCaretPosition.apply(this, []);
    }
  };
})(jQuery, document);