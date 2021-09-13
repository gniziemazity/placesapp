let places=[]

const user={

}

let mymap;

function main(){
    
    mymap = L.map('mapid').setView([62.601912233578524, 29.754385894106747], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    //handleGeolocation(mymap);

    var xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            places = JSON.parse(this.responseText)
                updateList(places,document.getElementById("places"));

                document.addEventListener("locationChange",(e)=>{
                    updateList(places,document.getElementById("places"));
                })

                updateMap(places,mymap);
        }
    }

    xhttp.open('GET', 'http://localhost:3001/api/places', true)
    xhttp.send()
}

const handleGeolocation=(map)=>{
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {

    }
}

const showPosition=(position)=>{
    if(user.marker==null){
        user.marker=L.marker([position.coords.latitude,position.coords.longitude],{
            icon:L.divIcon({
                html:"<div class='usermarkericon'>😊</div>"
            }),
            title:"You"
        }).addTo(mymap);
    }else{
        user.marker.setLatLng([position.coords.latitude,position.coords.longitude]);
    }
    document.dispatchEvent(new CustomEvent("locationChange",{
        detail:position.coords
    }) );
}

const clickListItem=placeId=>{
    const place=places.find(p=>p.id===placeId)
    place.marker.openPopup();
    mymap.setView(place.marker.getLatLng())
}

const updateList=(places,div)=>{
    let html="<div class='section-title'>What's Nearby</div>";
    places.forEach(p => {
        const dist=user.marker?formatDistance(Geo.gcd({
            latitude:user.marker.getLatLng().lat,
            longitude:user.marker.getLatLng().lng
        },p)):"";

        html+="<div class='listitem' onclick='clickListItem("+p.id+")'>";
        html+="<span class='username'>"+p.id+". "+p.user+"'s </span>"
            +"<span class='placetitle'>"+p.title+"</span>"
            +"<span class='distance'> "+dist+"</span>"
            +"<br>"+"<span class='coordinates'>"
            +p.latitude+", "+p.longitude+"</span>";
        html+="</div>";
        html+="<br>"
    });
    div.innerHTML=html;
}

const formatDistance=(distInKm)=>{
    if(distInKm<1){
        return Math.floor(distInKm*1000)+" meters";
    }else if(distInKm<100){
        return distInKm.toFixed(1)+" km";
    }else{
        return distInKm.toFixed(0)+" km";
    }
}

const updateMap=(places,map)=>{
    places.forEach(p => {
        const marker=L.marker([p.latitude,p.longitude],{
            icon:L.divIcon({
                html:"<div class='markericon'>"+p.id+"</div>"
            }),
            title:p.user+"'s "+p.title
        }).addTo(map);
        marker.bindPopup(p.user+"'s "+p.title);
        p.marker=marker;
    });
}
