// Rashidiya Room Mess — Service Worker v1
// Handles background push notifications

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(self.clients.claim());
});

// Handle notification click — open the site
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(function(clientList){
      // If site is already open, focus it
      for(var i=0; i<clientList.length; i++){
        var client=clientList[i];
        if(client.url&&'focus' in client) return client.focus();
      }
      // Otherwise open a new tab
      if(clients.openWindow){
        return clients.openWindow(e.notification.data&&e.notification.data.url||'/');
      }
    })
  );
});

// Handle push event (for future server-side push)
self.addEventListener('push', function(e){
  var data={title:'Rashidiya Room Mess', body:'You have a new notification', icon:''};
  try { data=e.data.json(); } catch(err){}
  e.waitUntil(
    self.registration.showNotification(data.title,{
      body:data.body,
      icon:data.icon||'https://em-content.zobj.net/source/apple/354/house_1f3e0.png',
      badge:'https://em-content.zobj.net/source/apple/354/house_1f3e0.png',
      vibrate:[200,100,200],
      tag:'rashidiya-mess',
      data:{url:data.url||self.location.origin}
    })
  );
});
