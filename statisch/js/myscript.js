var countries = [
    { label: 'United Kingdom', value: 'UK' },
    { label: 'United States', value: 'US' }
];
 
autocomplete({
    input: document.getElementById("country"),
    emptyMsg: "موردی یافت نشد",
    minLength: 3,
    fetch: function(req,res) {
        $.ajax({
            url: "http://localhost:3000/system/autocomplete/"+req,
            dataType: "jsonp",
            type: "GET",
            data: {
                term: req
            },
            success: function(data) {                
                res($.map(data, function(search) {
                    return {
                        label: search.majorFarsi,//text comes from a collection of mongo
                        value: search.majorId
                    };
                }));
            },
            error: function(xhr) {
                alert(xhr.status + ' : ' + xhr.statusText);
            }
        });
    },
    onSelect: function(search) {
        document.getElementById("showMajor").innerHTML = search.label;
        document.getElementById("MajorId").innerHTML = search.value;
    },
   
});