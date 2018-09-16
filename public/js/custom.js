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
                    for(var i=0; i<products.length; i++){
                        html += "<div class='col-md-4'>";
                        html += "<a href='/product/'"+products[i]._source._id+"'>";
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
                    }
                    html += "</div>"

                    $('#instant_search').append(html);
                    console.log(products);
                } else{
                    $('.search_results').show();
                    $('#paginatio').hide();
                    $("#instant_search").empty();
                }
            },
            error: function(error){
                console.log(error);
            }
        });
    });
});
