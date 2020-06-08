---
layout: post
title: Django Social
date: 2019-02-27
permalink: /blog/:title:output_ext
categories: [django, python, facebook]
tags: [2019]
comments: true
comment_issue_id: 1
---

<div class="paragraph">
  <h1 style="text-align:center;">How To Retrieve Facebook Extra Info From Django?</h1>

  <p>When we use <strong>python-social-auth</strong> sometimes there is a need to obtain some extra information from the Facebook about a registered user. </p>
  <p>Let's look at how to retrieve a list of friends and their location.</p>
</div>

<!-- more -->

To specify to which fields we need to have access, we need to add them to `SOCIAL_AUTH_FACEBOOK_SCOPE` list in `settings.py` file:

```python
SOCIAL_AUTH_FACEBOOK_SCOPE = [
    'email',
    'user_friends',
    'friends_location',
]
```

So when a user will try to log in to our website using his Facebook account, he will be asked if [our application can access his personal data](https://developers.facebook.com/docs/facebook-login/permissions/).

In our case the app will ask him for his email, list of his friends and their location.


If the user agrees,
`python-social-auth` will create an instance of `SocialUser` class.
While accessing `extra_data JSON`, we can get a Facebook token that will allow us to get the extra information we need via Facebook API.

Firstly, we get a `SocialUser` object:

```html
<pre lang="python">social_user = request.user.social_auth.filter(<br/> provider='facebook',<br/>).first()<br/></pre>
```

Since we got it, we can send a `GET` request to Facebook API, passing the user's uid, access token and a list of fields we aim for:

```python
if social_user:
    url = u'<a href="https://graph.facebook.com/{0}/'">https://graph.facebook.com/{0}/'</a> \
          u'friends?fields=id,name,location,picture' \
          u'&access;_token={1}'.format(
            social_user.uid,
            social_user.extra_data['access_token'],
          )
    request = urllib2.Request(url)
```

The API returns us a JSON with the data we requested:

```json
{
   "data":[
      {
         "id":"uid",
         "name":"John Doe",
         "location":{
            "id":"id",
            "name":"Bogotá, Colombia"
         },
         "picture":{
            "data":{
               "url":"avatar url",
               "is_silhouette":false
            }
         }
      }
   ]
}
```

So now we can load it to a Python dictionary:

```python
friends = json.loads(urllib2.urlopen(request).read()).get('data')
  for friend in friends:
    location = friend.get('location')
      # do something
```
