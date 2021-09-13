class Geo{
    static R=6371;//km
    static gcd=(latLon1,latLon2)=>{
        const p1=Geo.latLonToXYZ(latLon1,Geo.R);
        const p2=Geo.latLonToXYZ(latLon2,Geo.R);
        const eucl=Geo.euclidean(p1,p2);
        return 2*Geo.R*Math.asin(eucl/(2*Geo.R));
    }
    static euclidean=(p1,p2)=>{
        return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+
        (p1.y-p2.y)*(p1.y-p2.y)+
        (p1.z-p2.z)*(p1.z-p2.z));
    }
    static latLonToXYZ=(location)=>{
        const xyz={x:0, y:0, z:0};
        const r=Math.cos(Geo.degToRad(location.latitude))*Geo.R;
        
        xyz["y"]=Math.sin(Geo.degToRad(location.latitude))*Geo.R;
        xyz["x"]=Math.sin(Geo.degToRad(location.longitude))*r;
        xyz["z"]=Math.cos(Geo.degToRad(location.longitude))*r;
        
        return xyz;				
    }
    static degToRad(degree){
        return degree*Math.PI/180;
    }
}