# Podcast

A simple utility for generating a report about an RSS feed.  The script will download the feed and list the episodes and durations and cumulative stats about them.  The output will be a Bootstrap 4 HTML page.

## Example
Clone the repo and install npm modules
  git clone <repo>
  npm install
  ./bin/rss

### Show script help
Using the ./bin/rss bash script.
  # ./bin/rss
  # Usage: ./bin/rss <command> <options>
  # Commands:
  #   report    <rss-uri>   build a html report for given RSS feed
  #   list                  list common RSS feeds
  #

### List RSS feeds
This is just a helper to document the links for me.
  # ./bin/rss list
  https://risky.biz/feeds/risky-business/
  http://feeds.twit.tv/sn.xml


### Generate the reports
  # ./bin/rss report https://risky.biz/feeds/risky-business/ http://feeds.twit.tv/sn.xml
  Building report for https://risky.biz/feeds/risky-business/ into /Users/dfs/Documents/code/podcast/bin/../reports/risky-business.html...
  Building report for http://feeds.twit.tv/sn.xml into /Users/dfs/Documents/code/podcast/bin/../reports/sn.xml.html...

