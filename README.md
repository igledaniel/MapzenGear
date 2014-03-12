# Mapzen Gear

Start where you are

## Install Samsung SDK

## Build Notes and Best of Commands

### To build project

<pre><code>
$ web-packaging GearConsumer.wgt ./ 
</code></pre>

Then move GearConsumer.wgt to assets directory of MapzenAndroid project and deploy


### To log on the device

Place watch in the cradle and plug into your machine. Then issue 


<pre><code>$ sdb dlog | grep "MapzenGear"</pre></code>

To watch application notices while running

### To install directoy onto the GEAR

<pre><code>$ sdb install GearConsumer.wgt </code></pre>

to uninstall

<pre><code>$ sdb uninstall >package_id< </code></pre>
