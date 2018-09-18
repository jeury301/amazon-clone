$(function(){
    Stripe.setPublishableKey('pk_test_denzfzfxS417yaBoAKq9MY0h');

    var opts = {
        lines: 13, // The number of lines to draw
        length: 38, // The length of each line
        width: 17, // The line thickness
        radius: 45, // The radius of the inner circle
        scale: 1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#ffffff', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        speed: 1, // Rounds per second
        rotate: 0, // The rotation offset
        animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: '0 0 1px transparent', // Box-shadow for the lines
        position: 'absolute' // Element positioning
    };



    $("#search").keyup(function(){
        var search_term = $(this).val();

        $.ajax({
            method: 'POST',
            url:'/api/search',
            data: {
                search_term
            },
            dataType: 'json',
            success: function(result){
                var products = result.hits.hits.map(function(hit){
                    return hit;
                });

                if (search_term){
                    // cleaning up html results
                    $('.search_results').hide();
                    $('#pagination').hide();
                    var html = "";
                    var added = new Set();
                    for(var i=0; i<products.length; i++){
                        if(!added.has(products[i]._source.name)){
                            html += "<div class='col-md-4'>";
                            html += "<a href='/product/"+products[i]._id+"'>";
                            html += "<div class='thumbnail'>";
                            html += "<img src="+products[i]._source.image+">";
                            html += "<div class='caption'>";
                            html += "<h3>"+products[i]._source.name+"</h3>";
                            html += "<p>"+products[i]._source.category_name+"</p>";
                            html += "<p>$"+products[i]._source.price+"</p>";
                            html += "</div></div></a></div>"

                            if ((i+1)%3===0) {
                                html += "</div><div class='row search_results'>"
                            }

                            added.add(products[i]._source.name)
                        }
                    }
                    html += "</div>"

                    $('#instant_search').append(html);
                    console.log(products);
                } else{
                    $('.search_results').show();
                    $('#pagination').show();
                    $("#instant_search").empty();
                }
            },
            error: function(error){
                console.log(error);
            }
        });
    });

    $(document).on('click', '#plus', function(e){
        e.preventDefault();
        var price_value = parseFloat($("#price_value").val());
        var quantity = parseInt($("#quantity").val());

        price_value += parseFloat($("#price_hidden").val());
        quantity += 1;

        $("#quantity").val(quantity);
        $("#price_value").val(price_value.toFixed(2));
        $("#total").html(quantity);
    });

    $(document).on('click', '#minus', function(e){

        e.preventDefault();
        var price_value = parseFloat($("#price_value").val());
        var quantity = parseInt($("#quantity").val());

        if(quantity > 1){
            price_value -= parseFloat($("#price_hidden").val());
            quantity -= 1;

            $("#quantity").val(quantity);
            $("#price_value").val(price_value.toFixed(2));
            $("#total").html(quantity);
        }
    });

    function stripeResponseHandler(status, response){
        var $form = $('#payment-form');

        console.log(JSON.stringify($form.data))
        if(response.error){
            $form.find('.payment-errors').text(response.error.message);
            $form.find('button').prop('disabled', false);
        } else{
            var token = response.id;
            $form.append($('<input type="hidden" name="stripe_token"/>').val(token));

            $('#loading').append('<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>');
            $form.get(0).submit();
        }
    }

    $('#payment-form').submit(function(event){
        // var $form = $(this);
        //
        // console.log($form)
        // $form.find('button').prop('disabled', true);
        //
        // Stripe.card.createToken($form, stripeResponseHandler);
        //
        // return false;
    });

});
