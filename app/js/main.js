'use strict';
var Main = function() {
	this.companies = function() {
		$.ajax({
			type:'POST',
			dataType:'json',
			url:'http://codeit.pro/frontTestTask/company/getList',
      success: function(jsonData) {
        var arrCount = []; //array will collect here
        $('.count_partner').text(jsonData.list.length - 1);
        for (var nameComp in jsonData.list) {
          var name = jsonData.list[nameComp].name; //Companies
          var sum = jsonData.list.length -1; //General sum
          var loc = jsonData.list[nameComp].location.name; //Countries

          var res = {}; //result will here
          for (var k = 0; k < loc.length; k++) {
            arrCount.push(loc);
            arrCount.forEach(function(a) {
              res[a] = res[a] + 1 || 1;
            });
            break;
          }

          $('.list_of_companies h2').after('<p class="company_name" data-name='+ name +'>' + name + '</p>');
        }


        this.chart = function() {

          google.charts.load('current', {packages: ['corechart']});
          google.charts.setOnLoadCallback(drawChart);

          function drawChart() {
            // Define the chart to be drawn.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Element');
            data.addColumn('number', 'Percentage');
            for (var key in res) {
              data.addRows([
                [key, res[key] * 100 / sum],
              ]);
            }
            // Instantiate and draw the chart.
            var chart = new google.visualization.PieChart(document.getElementById('companies_chart'));
            chart.draw(data, null);

              google.visualization.events.addListener(chart, 'select', function() {
                $('.companies_in_countries').empty();
                var companies = data.getValue(chart.getSelection()[0].row, 0).toLowerCase();
                var getCountry = data.getValue(chart.getSelection()[0].row, 0).toLowerCase();
                var chartHide = document.getElementById('companies_chart');
                if (~getCountry.indexOf(getCountry)) {
                	$('.companies_in_countries').append('<strong>' + getCountry + '</strong>')
                  for (var compName in jsonData.list) {
                    if (jsonData.list[compName].location.name.toLowerCase().indexOf(companies) != -1) {
                      $('#companies_chart').fadeOut(200);
                      $('.back_arrow').fadeIn(200);
                      $('.companies_in_countries').append('<p class="country_chart">' + jsonData.list[compName].name + '</p>');
                    }
                    // console.log(data.getValue(chart.getSelection()[0].row, 0).toLowerCase());
                  }
                }
              });
          }
        }
        this.chart();

        $('.back_arrow').on('click', function() {
          $('.companies_in_countries').empty();
          $('#companies_chart').fadeIn(200);
          $('.back_arrow').fadeOut(200);
        });

				$('.company_name').on('click', function() {
					$('.company_partners').empty();
					$('.company_name').removeClass('active');
					$(this).addClass('active');
					$('.company_partners_wrap').fadeIn(120);
					var nameInp = $(this).text();
					var nameLower = nameInp.toLowerCase();
					var arr = [];
          for (var nameComp in jsonData.list) {
            var name = jsonData.list[nameComp].name;
            var nLower = name.toLowerCase();
            if (nameInp.indexOf(name) != -1) {
              for (var partners in jsonData.list[nameComp].partners) {
                var partner = jsonData.list[nameComp].partners[partners];
									arr.push(partner.name);
                $('.company_partners').append('<p class="partners" id=' + partner.value+" data-name=" + partner.name +'><span class="parnter_name">' + partner.name + '</span><span class="parnter_percent" data-perc='+ partner.value +'>'+ partner.value + '%</span></p>');
                $('.percentage').click();
              }
						}
					}
				});

				$('.btn_sort').on('click', function() {
					if ($(this).hasClass('sort_name')) {
            var sort_by_name = function(a, b) {
              return a.innerHTML.toLowerCase() > (b.innerHTML.toLowerCase());
            }
            var list = $(".company_partners > .partners").get();
            list.sort(sort_by_name);

            for (var i = 0; i < list.length; i++) {
              list[i].parentNode.appendChild(list[i]);
            }
          } else {
            var sort_by_perc = function(a, b) {
              return a.getAttribute('id').toLowerCase() > (b.getAttribute('id').toLowerCase());
            }
            var list = $(".company_partners > .partners").get();
            list.sort(sort_by_perc).reverse();

            for (var i = 0; i < list.length; i++) {
              list[i].parentNode.appendChild(list[i]);
            }
					}
				});
			}
		});
	};

	this.news = function() {
		$.ajax({
			type:'POST',
			dataType:'json',
			url:'http://codeit.pro/frontTestTask/news/getList',
			beforeSend: function() {
				$('.preloader').fadeIn(100);
			},
			success: function(jsonData) {
				for (var news in jsonData.list) {
					var oneNew = jsonData.list[news];
					var str = '<div class="one_news">\
									<div class="one_news_leftSide">\
										<img src="{src}" alt="news">\
										<p class="author">Author: <span>{author}</span></p>\
										<p class="date">Public: <span>{date}</span></p>\
									</div>\
									<div class="one_news_rightSide clearfix">\
									<h3><a href="{title}">{title}</a></h3>\
										<div class="one_news_descr">{descr}</div>\
									</div>\
								</div>';
					var news_repl = str;
					news_repl = news_repl.replace('{src}', oneNew.img);
					news_repl = news_repl.replace('{author}', oneNew.author);
					news_repl = news_repl.replace('{date}', dateConvert(oneNew.date));
					news_repl = news_repl.replace('{descr}', oneNew.description);
					news_repl = news_repl.replace('{title}', oneNew.link);
					news_repl = news_repl.replace('{title}', oneNew.link);

					$('.news_slider').append(news_repl);
				}
			},
			complete: function() {
				$('.news_slider').slick({
					arrows: false,
					dots: true
				});
				$('.preloader').fadeOut(200);
			}
		});
	};


	function dateConvert(time) {
		var timestamp = time;
		var date = new Date();
		date.setTime(timestamp * 1000);
		return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
	}

	$('.reg_form input').on('input', function() {
		var self = $(this);
		if (self.val().length <= 4) {
			self.css('background','red');
			return false;
		} else {
			self.css('background','green');
		}
	});

	$('.btn_reg').on('click', function() {
		var checkbox = $('#agree').is(':checked');
		if ($('.reg_form input').val().length <= 4) {
			swal(
			  'Oops...',
			  'Заполните поля',
			  'error'
			);
			return false;
		} else if (checkbox == false) {
			swal(
			  'Oops...',
			  'Ознакомьтесь с условиями',
			  'error'
			);
			return false;
		}
		var data = $('.reg_form').serialize();
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: 'http://codeit.pro/frontTestTask/user/registration',
			data: data,
			success: function(jsonData) {
				if (jsonData.status == "Form Error") {
					console.log(jsonData);
					swal(
					  'Oops...',
					  jsonData.message,
					  'error'
					);
					return false;
				} else if (jsonData.status == 'Error') {
					console.log(jsonData);
					swal(
					  'Oops...',
					  jsonData.message,
					  'error'
					);
				} else {
					console.log(jsonData);
					swal(
					  'Good job!',
					  jsonData.message,
					  'success'
					)
					setTimeout(function() {
						window.location.href = '/companies.html';
					}, 1500);
				}
			}
		});
	});


	$("img, a").on("dragstart", function(event) { event.preventDefault(); });
}

var general = new Main();