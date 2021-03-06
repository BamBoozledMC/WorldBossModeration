'use strict';

$(document).ready(function () {
  var converter = new showdown.Converter();

  var switches = {
    title: false,
    url: false,
    icon: false,
    useVars: false
  };

  var fields = 1;

  var source = "";

  var embed = {
    title: "",
    author: {
      name: "",
      url: "",
      icon_url: ""
    },
    description: "",
    url: "",
    thumbnail: {
      url: ""
    },
    image: {
      url: ""
    },
    color: "",
    fields: [{}],
    footer: {
      text: ""
    },
  };
  var msgcontent = "";

  function resetEmbed() {
    $('.embed-inner').html("");
    $('.embed-footer').remove();
    $('.embed-thumb').remove();
    $('.embed-image').remove();
    $('.msgbox').html("");
  }

  function updateEmbed(embed) {
    resetEmbed();

    // add basic embed generation to source
    source = 'embed=discord.Embed(';

    if (embed.url) {
      $('.embed-inner').append('<div class="embed-title"><a href="' + embed.url + '">' + embed.title + '</a></div>');

      // update source
      if (switches.useVars) {
        source += 'title=' + embed.title + ', url=' + embed.url;
      } else {
        source += 'title="' + embed.title + '", url="' + embed.url + '"';
      }
    } else if (embed.title.length === 0) {
      source += "";
    } else {
      embed.title = escapeS(embed.title);

      $('.embed-inner').append('<div class="embed-title">' + embed.title + '</div>');

      // update source
      if (switches.useVars) {
        source += 'title=' + embed.title;
      } else {
        source += 'title="' + embed.title + '"';
      }

    }

    if (embed.description) {
      embed.description = escapeS(embed.description);

      $('.embed-inner').append('<div class="embed-description">' + converter.makeHtml(embed.description) + '</div>');

      if (embed.title.length > 0 || embed.url.length > 0) {
        source += ', '
      }

      // update source
      if (switches.useVars) {
        source += 'description=' + embed.description;
      } else {
        source += 'description="' + embed.description + '"';
      }
    }

    if (msgcontent) {
      msgcontent = escapeS(msgcontent);

      $('.msgbox').append('<div class="text-white">' + converter.makeHtml(msgcontent) + '</div>');

      if (embed.title.length > 0 || embed.url.length > 0) {
        source += ', '
      }

      // update source
      if (switches.useVars) {
        source += 'content=' + msgcontent;
      } else {
        source += 'content="' + msgcontent + '"';
      }
    }

    if (embed.color) {
      $('.side-colored').css('background-color', embed.color);

      if (embed.title.length > 0 || embed.url.length > 0) {
        source += ', '
      }

      // update source
      source += 'color=0x' + embed.color.substr(1);
    }

    // finished the basic setup
    source += ')\n';

    if (embed.author.name) {
      // add author to source
      source += 'embed.set_author(';

      embed.author.name = escapeS(embed.author.name);

      $('.embed-title').before('<div class="embed-author"><a class="embed-author-name" href="' + embed.author.url + '">' + embed.author.name + '</a></div>');

      // update source
      if (switches.useVars) {
        source += 'name=' + embed.author.name;
      } else {
        source += 'name="' + embed.author.name + '"';
      }

      if(embed.author.url) {
        source += ', ';

        if (switches.useVars) {
          source += 'url=' + embed.author.url;
        } else {
          source += 'url="' + embed.author.url + '"';
        }
      }

      if (embed.author.icon_url) {
        $('.embed-author-name').before('<img class="embed-author-icon" src="' + embed.author.icon_url + '" />');

        source += ', ';

        // update source
        if (switches.useVars) {
          source += 'icon_url=' + embed.author.icon_url;
        } else {
          source += 'icon_url="' + embed.author.icon_url + '"';
        }
      }

      // finish author
      source += ')\n';
    }

    if (embed.thumbnail.url) {
      // add thumbnail
      source += 'embed.set_thumbnail(';

      $('.card.embed .card-block').append('<img class="embed-thumb" src="' + embed.thumbnail.url + '" />');
      $('.embed-thumb').height($('.embed-thumb')[0].naturalHeight);

      // update source
      if (switches.useVars) {
        source += 'url=' + embed.thumbnail.url;
      } else {
        source += 'url="' + embed.thumbnail.url + '"';
      }

      // finish thumbnail
      source += ')\n';
    }

    if (embed.image.url) {
      // add thumbnail
      source += 'embed.set_thumbnail(';

      $('.card.embed').append('<img class="embed-image" src="' + embed.image.url + '" />');

      // update source
      if (switches.useVars) {
        source += 'url=' + embed.image.url;
      } else {
        source += 'url="' + embed.image.url + '"';
      }

      // finish thumbnail
      source += ')\n';
    }

    if (embed.fields.length > 0) {
      $('.embed-inner').append('<div class="fields"></div>');
    }

    for (var _iterator = embed.fields, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var field = _ref;

      field.name = escapeS(field.name);
      field.value = escapeS(field.value);

      $('.embed-inner .fields').append('\n        <div class="field ' + (field.inline && 'inline') + '">\n          <div class="field-name">' + field.name + '</div>\n          <div class="field-value">' + converter.makeHtml(field.value) + '</div>\n        </div>\n      ');

      // add field
      if (switches.useVars) {
        source += 'embed.add_field(name=' + field.name + ', value=' + field.value + ', inline=' + (field.inline && 'True' || 'False') + ')\n';
      } else {
        source += 'embed.add_field(name="' + field.name + '", value="' + field.value + '", inline=' + (field.inline && 'True' || 'False') + ')\n';
      }
    }

    if (embed.footer.text) {
      embed.footer.text = escapeS(embed.footer.text);

      $('.card.embed').append('<div class="embed-footer"><span>' + embed.footer.text + '</span></div>');

      // add footer
      if (switches.useVars) {
        source += 'embed.set_footer(text=' + embed.footer.text + ')\n';
      } else {
        source += 'embed.set_footer(text="' + embed.footer.text + '")\n';
      }
    }

    // add send function
    source += 'await self.bot.say(embed=embed)\n';

    let msgEmbed = {
      content: msgcontent,
      embeds: [embed]
    }
    $('.json-source').text(JSON.stringify(msgEmbed));
  }

  // run once on startup
  updateEmbed(embed);
  document.getElementById("refreshembed").addEventListener("click", function() {
    $('.form-control').trigger('input')
    $('.form-check-input').trigger('input')
    $('.form-control').trigger('change')
  })

  function generateInputFields(fields) {
    // generate inputs for fields
    $('.input-fields').html("");

    var _loop = function _loop(i) {
      $('.input-fields').append('<div class="form-group row">\n        <div class="col-sm-4">\n          <input class="form-control" id="field-' + i + '-name" type="text" placeholder="name" value="' + (embed.fields[i].name !== undefined ? embed.fields[i].name : "") + '" />\n        </div>\n        <div class="col-sm-4">\n          <input class="form-control" id="field-' + i + '-value" type="text" placeholder="value" value="' + (embed.fields[i].value !== undefined ? embed.fields[i].value : "") + '" />\n        </div>\n        <div class="col-sm-2">\n          <div class="form-check">\n            <label class="form-check-label">\n              <input class="form-check-input" id="field-' + i + '-inline" type="checkbox" ' + (embed.fields[i].inline !== undefined ? `${embed.fields[i].inline ? 'checked' : ""}` : "") + '> Inline\n            </label>\n          </div>\n        </div>\n        <div class="col-sm-2">\n          <button id="field-' + i + '-delete" class="btn btn-danger">Delete</button>\n        </div>\n      </div>');
      $('#field-' + i + '-name').on('input', function () {
        updateFieldName(i, $('#field-' + i + '-name').val());
      });

      $('#field-' + i + '-value').on('input', function () {
        updateFieldValue(i, $('#field-' + i + '-value').val());
      });

      $('#field-' + i + '-inline').click(function () {
        updateFieldInline(i, $('#field-' + i + '-inline').is(':checked'));
      });

      $('#field-' + i + '-delete').click(function (e) {
        e.preventDefault();
        deleteField(i);
      });
    };

    for (var i = 0; i < fields; i++) {
      _loop(i);
    }
    $('.input-fields').append('<button id="add-field" class="btn btn-success">Add field</button>');
    $('#add-field').click(function (e) {
      e.preventDefault();
      addField();
    });
  }

  generateInputFields(fields);

  function updateFieldName(index, value) {
    embed.fields[index].name = value.replace(/"/g, "'");
    updateEmbed(embed);
  }

  function updateFieldValue(index, value) {
    embed.fields[index].value = value.replace(/"/g, "'");
    updateEmbed(embed);
  }

  function updateFieldInline(index, value) {
    embed.fields[index].inline = value.replace(/"/g, "'");
    updateEmbed(embed);
  }

  function deleteField(index) {
    embed.fields.splice(index, 1);
    updateEmbed(embed);
    fields -= 1;
    generateInputFields(fields);
  }

  function addField() {
    embed.fields.push({ inline: true });
    fields += 1;
    generateInputFields(fields);
  }

  function updateTitle(value) {
    embed.title = value.replace(/"/g, "'") || "";
    updateEmbed(embed);
  }

  function updateUrl(value) {
    embed.url = value.replace(/"/g, "'") || "";
    updateEmbed(embed);
  }

  function updateThumb(value) {
    embed.thumbnail.url = value.replace(/"/g, "'") || "";
    updateEmbed(embed);
  }
  function updateImage(value) {
    embed.image.url = value.replace(/"/g, "'") || "";
    updateEmbed(embed);
  }

  function updateDescription(value) {
    embed.description = value.replace(/"/g, "'") || "";
    updateEmbed(embed);
  }

  function updateContent(value) {
    msgcontent = value.replace(/"/g, "'") || "";
    updateEmbed(embed);
  }

  function updateColor(value) {
    embed.color = value.replace(/"/g, "'") || false;
    updateEmbed(embed);
  }

  function updateAuthorName(value) {
    embed.author.name = value.replace(/"/g, "'") || "";
    updateEmbed(embed);
  }

  function updateAuthorUrl(value) {
    embed.author.url = value.replace(/"/g, "'") || "";
    updateEmbed(embed);
  }

  function updateAuthorIcon(value) {
    embed.author.icon_url = value.replace(/"/g, "'") || "";
    updateEmbed(embed);
  }

  function updateFooter(value) {
    embed.footer.text = value.replace(/"/g, "'") || "";
    updateEmbed(embed);
  }

  function escapeS(str) {
    if (str) {
        try {
            return str = JSON.parse('"' + str + '"');
        } catch (SyntaxEror) {
            return str;
        }
    }
  }

  $('#form').submit(function (e) {
    e.preventDefault();
  });

  // checking helpers
  function addWarning(item, type, message) {
    item.addClass('form-control-warning');
    item.removeClass('form-control-success');
    item.parent().addClass('has-warning');
    item.parent().removeClass('has-success');
    if ($('#' + type + '-feedback').length === 0) {
      item.after('<div class="form-control-feedback" id="' + type + '-feedback">' + message + '</div>');
    }
  }

  function addSuccess(item, type) {
    item.removeClass('form-control-warning');
    item.addClass('form-control-success');
    item.parent().addClass('has-success');
    item.parent().removeClass('has-warning');
    $('#' + type + '-feedback').remove();
  }

  $('#title').on('input', function () {
    var item = $('#title');
    var title = item.val();

    // update
    updateTitle(title);
  });

  $('#url').on('input', function () {
    var item = $('#url');
    var url = item.val();

    if (url.substr(0, 4) !== 'http' && url.length !== 0 && !switches.useVars) {
      addWarning(item, 'url', 'not a valid url');
    } else {
      addSuccess(item, 'url');
      // update
      updateUrl(url);
    }
  });

  $('#icon').on('input', function () {
    var item = $('#icon');
    var icon = item.val();

    if (icon.substr(0, 4) !== 'http' && icon.length !== 0 && !switches.useVars) {
      addWarning(item, 'icon', 'not a valid url');
    } else {
      addSuccess(item, 'icon');
      // update
      updateThumb(icon);
    }
  });
  $('#image').on('input', function () {
    var item = $('#image');
    var icon = item.val();

    if (icon.substr(0, 4) !== 'http' && icon.length !== 0 && !switches.useVars) {
      addWarning(item, 'image', 'not a valid url');
    } else {
      addSuccess(item, 'image');
      // update
      updateImage(icon);
    }
  });

  $('#description').on('input', function () {
    var item = $('#description');
    var description = item.val();
    addSuccess(item, 'description');
    // update
    updateDescription(description);
  });

  $('#msgcontent').on('input', function () {
    var item = $('#msgcontent');
    var content = item.val();
    addSuccess(item, 'content');
    // update
    updateContent(content);
  });

  $('#color').on('change', function () {
    updateColor($('#color').val());
  });

  $('#author_name').on('input', function () {
    var item = $('#author_name');
    var author_name = item.val();

    addSuccess(item, 'author_name');
    // update
    updateAuthorName(author_name);
  });

  $('#author_url').on('input', function () {
    var item = $('#author_url');
    var author_url = item.val();

    if (author_url.substr(0, 4) !== 'http' && author_url.length !== 0 && !switches.useVars) {
      addWarning(item, 'author_url', 'not a valid url');
    } else {
      addSuccess(item, 'author_url');
      // update
      updateAuthorUrl(author_url);
    }
  });

  $('#author_icon').on('input', function () {
    var item = $('#author_icon');
    var author_icon = item.val();

    if (author_icon.substr(0, 4) !== 'http' && author_icon.length !== 0 && !switches.useVars) {
      addWarning(item, 'author_icon', 'not a valid url');
    } else {
      addSuccess(item, 'author_icon');
      // update
      updateAuthorIcon(author_icon);
    }
  });

  $('#footer').on('input', function () {
    var item = $('#footer');
    var footer = item.val();

    addSuccess(item, 'footer');
    // update
    updateFooter(footer);
  });

  $('#useVars').click(function () {
    switches.useVars = !switches.useVars;
    updateEmbed(embed);
  });
});
