$(function(){
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
});
