package youshanwanshui.control.Controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import netscape.javascript.JSObject;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.multipart.MultipartFile;

import java.awt.desktop.SystemSleepEvent;
import java.io.*;
import java.util.*;

@RestController
public class HelloController {
    String picPath = System.getProperty("user.dir") + "/src/main/pics";

    @GetMapping("/hello")
    public String hello() {
        System.out.println(picPath);
        return "Hello World for Bytedance!";
    }
    
    @RequestMapping(value="/getNodeDetail", method=RequestMethod.GET)
    public String getNodeDetail(@RequestParam(value="openid", required=false, defaultValue="general") String openid, @RequestParam("nodeName") String nodeName) {
        JSONParser jsonParser = new JSONParser();
        JSONObject rtn = new JSONObject();
        try (FileReader reader = new FileReader("src/main/data/nodes.json")) {
            Object obj = jsonParser.parse(reader);
            
            JSONObject strategyMap = (JSONObject) obj;
            JSONObject userStrategy = (JSONObject) strategyMap.get(openid);
            rtn = (JSONObject) userStrategy.get(nodeName);
            
            System.out.println(rtn);
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        if (rtn==null) {
            return "error";
        } else {
            return rtn.toString();
        }
        
    }
    
    @GetMapping(value="/search")
    public String search(
            @RequestParam(value="genre", required=false, defaultValue="both") String genre,
            @RequestParam(value="keyword") String keyword
    ) {
        JSONParser jsonParser = new JSONParser();
        JSONObject rtn = new JSONObject();
        JSONArray nodes = new JSONArray();
        JSONArray strategies = new JSONArray();
        try (FileReader reader = new FileReader("src/main/data/nodes.json")) {
            Object obj = jsonParser.parse(reader);
        
            JSONObject nodeOrigin = (JSONObject) obj;
            for (Object user: nodeOrigin.keySet()) {
                JSONObject tmp = (JSONObject) nodeOrigin.get(user.toString());
                if (tmp.size() <= 0) continue;
                for (Object key: tmp.keySet()) {
                    if (key.toString().indexOf(keyword) > -1) nodes.add(user.toString()+"_"+key.toString());
                }
            }
            
            rtn.put("nodes", nodes);
        
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    
        try (FileReader reader = new FileReader("src/main/data/strategies.json")) {
            Object obj = jsonParser.parse(reader);
        
            JSONObject strategyOrigin = (JSONObject) obj;
            for (Object user: strategyOrigin.keySet()) {
                JSONObject tmp = (JSONObject) strategyOrigin.get(user.toString());
                for (Object key: tmp.keySet()) {
                    if (key.toString().indexOf(keyword) > -1) strategies.add(user.toString()+"_"+key.toString());
                }
            }
            
            rtn.put("strategies", strategies);
        
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    
        System.out.println(rtn);
        
        if (rtn==null) {
            return "error";
        } else {
            return rtn.toString();
        }
    }
    
    @RequestMapping(value="/getNodes", method=RequestMethod.GET)
    public String getNodes(
            @RequestParam(value="openid", required=false, defaultValue="general") String openid
    ) {
        JSONParser jsonParser = new JSONParser();
        JSONObject rtn = new JSONObject();
        try (FileReader reader = new FileReader("src/main/data/nodes.json")) {
            Object obj = jsonParser.parse(reader);
            
            JSONObject strategyMap = (JSONObject) obj;
            JSONObject nodes = (JSONObject) strategyMap.get(openid);
            
            JSONArray nodeNames = new JSONArray();
            for (Object key: nodes.keySet()) {
                nodeNames.add(key.toString());
            }
            rtn.put("nodes", nodeNames);
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        if (rtn==null) {
            return "error";
        } else {
            return rtn.toString();
        }
        
    }
    
    @RequestMapping(value="/delNodes", method=RequestMethod.GET)
    public String delNodes(
            @RequestParam(value="openid", required=false, defaultValue="general") String openid,
            @RequestParam(value="nodeName", required=false, defaultValue="all") String nodeName
    ) {
        JSONParser jsonParser = new JSONParser();
        JSONObject origin = new JSONObject();
        int flag = 0;
        try (FileReader reader = new FileReader("src/main/data/nodes.json")) {
            Object obj = jsonParser.parse(reader);
            
            origin = (JSONObject) obj;
            JSONObject nodes = (JSONObject) origin.get(openid);
            if (nodeName == "all") {
                origin.put(openid, new JSONObject());
            } else {
                nodes.remove(nodeName);
            }
    
            try (FileWriter file = new FileWriter("src/main/data/nodes.json")) {
                file.write(origin.toJSONString());
                file.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
            
            flag = 1;
            
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        
        if (flag == 1) return "success";
        else return "error";
        
    }
    
    @RequestMapping(value="/delStrategies", method=RequestMethod.GET)
    public String delStrategies(
            @RequestParam(value="openid", required=false, defaultValue="general") String openid,
            @RequestParam(value="strategyName", required=false, defaultValue="all") String strategyName
    ) {
        JSONParser jsonParser = new JSONParser();
        JSONObject origin = new JSONObject();
        int flag = 0;
        try (FileReader reader = new FileReader("src/main/data/strategies.json")) {
            Object obj = jsonParser.parse(reader);
            
            origin = (JSONObject) obj;
            JSONObject strategies = (JSONObject) origin.get(openid);
            if (strategyName == "all") {
                origin.put(openid, new JSONObject());
            } else {
                strategies.remove(strategyName);
            }
            
            try (FileWriter file = new FileWriter("src/main/data/strategies.json")) {
                file.write(origin.toJSONString());
                file.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
            
            flag = 1;
            
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        
        if (flag == 1) return "success";
        else return "error";
        
    }
    
    
    
    @RequestMapping(value="/getStrategies", method=RequestMethod.GET)
    public String getStrategies(
            @RequestParam(value="openid", required=false, defaultValue="general") String openid
    ) {
        JSONParser jsonParser = new JSONParser();
        JSONObject rtn = new JSONObject();
        try (FileReader reader = new FileReader("src/main/data/strategies.json")) {
            Object obj = jsonParser.parse(reader);
            
            JSONObject strategyMap = (JSONObject) obj;
            JSONObject strategies = (JSONObject) strategyMap.get(openid);
            
            JSONArray strategyNames = new JSONArray();
            for (Object key: strategies.keySet()) {
                strategyNames.add(key.toString());
            }
            rtn.put("strategies", strategyNames);
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        if (rtn==null) {
            return "error";
        } else {
            return rtn.toString();
        }
        
    }
    
    @RequestMapping(value="/getStrategyDetail", method=RequestMethod.GET)
    public String getStrategyDetail(
            @RequestParam(value="openid", required=false, defaultValue="general") String openid,
            @RequestParam(value="strategyName", required=true) String strategyName
    ) {
        System.out.println(openid);
        System.out.println(strategyName);
        JSONParser jsonParser = new JSONParser();
        JSONObject rtn = new JSONObject();
        try (FileReader reader = new FileReader("src/main/data/strategies.json")) {
            Object obj = jsonParser.parse(reader);
            
            JSONObject strategyMap = (JSONObject) obj;
            JSONObject strategies = (JSONObject) strategyMap.get(openid);
            JSONObject strategy = (JSONObject) strategies.get(strategyName);
            JSONArray nodeNames = (JSONArray) strategy.get("nodes");
            
            try (FileReader nodeReader = new FileReader("src/main/data/nodes.json")) {
                Object nodeObj = jsonParser.parse(nodeReader);
    
                JSONObject nstrategyMap = (JSONObject) nodeObj;
                JSONObject nstrategies = (JSONObject) nstrategyMap.get(openid);
                JSONArray nodes = new JSONArray();
                
                for (Object node: nodeNames) {
                    JSONObject tmpobj = (JSONObject) nstrategies.get(node.toString());
                    if (tmpobj != null) {
                        tmpobj.put("title", node.toString());
                        nodes.add(tmpobj);
                    }
                }
                
                rtn.put("nodes", nodes);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        if (rtn==null) {
            return "error";
        } else {
            return rtn.toString();
        }
        
    }
    
    @RequestMapping(value="/getRecommendStrategies", method=RequestMethod.GET)
    public String getRecommendStrategies(
            @RequestParam(value="openid", required=false, defaultValue="general") String openid) {
    
        JSONParser jsonParser = new JSONParser();
        JSONObject rtn = new JSONObject();
        try (FileReader reader = new FileReader("src/main/data/strategies.json")) {
            Object obj = jsonParser.parse(reader);
        
            JSONObject origin = (JSONObject) obj;
            JSONObject strategies = (JSONObject) origin.get(openid);
            JSONArray names = new JSONArray();
            
            for (Object key: strategies.keySet()) {
                names.add(key.toString());
            }
            System.out.println(names);
            rtn.put("recommend", names);
        
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    
        if (rtn==null) {
            return "error";
        } else {
            return rtn.toString();
        }
    }
    
    @RequestMapping(value="/getUserInfo", method=RequestMethod.GET)
    public String getUserInfo(
            @RequestParam(value="openid", required=true) String openid,
            @RequestParam(value="userName", required=true) String userName) {
        
        JSONParser parser = new JSONParser();
        JSONObject rtn = null;
        JSONObject origin = null;
        int loadFlag = 0;
        try (FileReader reader = new FileReader("src/main/data/userInfo.json")) {
            Object obj = parser.parse(reader);
        
            origin = (JSONObject) obj;
            rtn = (JSONObject) origin.get(openid);
        
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            loadFlag = 1;
        } catch (IOException e) {
            e.printStackTrace();
            loadFlag = 1;
        } catch (ParseException e) {
            e.printStackTrace();
            loadFlag = 1;
        }
        if (loadFlag > 0) return "error";
    
        if (rtn==null) {
            rtn = new JSONObject();
            rtn.put("nickName", userName);
            rtn.put("gender", "未设置");
            rtn.put("age", "未设置");
            rtn.put("phone", "未设置");
            
            origin.put(openid, rtn);
            try (FileWriter file = new FileWriter("src/main/data/userInfo.json")) {
                file.write(origin.toJSONString());
                file.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return rtn.toString();
        } else {
            return rtn.toString();
        }
    }
    
    @RequestMapping(value="/changeUserInfo", method=RequestMethod.POST)
    public String changeUserInfo(
            @RequestParam(value="openid", required=true) String openid,
            @RequestParam(value="which", required=true) String which,
            @RequestParam(value="value", required=true) String value
    ) {
        JSONParser jsonParser = new JSONParser();
        JSONObject rtn = new JSONObject();
        JSONObject origin = null;
        int flag = 0;
        try (FileReader reader = new FileReader("src/main/data/userInfo.json")) {
            Object obj = jsonParser.parse(reader);
        
            origin = (JSONObject) obj;
            JSONObject info = (JSONObject) origin.get(openid);
        
            switch (which) {
                case "nickName":
                    info.put("nickName", value);
                    break;
                case "gender":
                    info.put("gender", value);
                    break;
                case "phone":
                    info.put("phone", value);
                    break;
                case "age":
                    info.put("age", value);
                    break;
            }
            flag = 1;
        
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    
        
        
        if (flag == 1) {
            try (FileWriter file = new FileWriter("src/main/data/userInfo.json")) {
                file.write(origin.toJSONString());
                file.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return "修改值已保存";
        } else {
            return "error";
        }
    }
    
    @RequestMapping(value="/postNode", method=RequestMethod.POST)
    public String postNode(
            @RequestParam(value="openid", required=true) String openid,
            @RequestParam(value="title", required=true) String title,
            @RequestParam(value="date", required=true) String date,
            @RequestParam(value="place", required=true) String place,
            @RequestParam(value="transportation", required=true) String transportation,
            @RequestParam(value="price", required=true) String price,
            @RequestParam(value="commentText", required=true) String commentText,
            @RequestParam(value="commentRadio", required=true) String commentRadio,
            @RequestParam(value="recommendation", required=true) String recommendation,
            @RequestParam(value="picNum", required=true) String picNum) {
    
        JSONParser jsonParser = new JSONParser();
        JSONObject origin = new JSONObject();
        try (FileReader reader = new FileReader("src/main/data/nodes.json")) {
            Object obj = jsonParser.parse(reader);
            int flag = 1;
        
            origin = (JSONObject) obj;
            JSONObject certainUser = (JSONObject) origin.get(openid);
            
            if (certainUser == null) {
                certainUser = new JSONObject();
                flag = 0;
            }
            
            JSONObject tmpStrategy = new JSONObject();
    
            tmpStrategy.put("date", date);
            tmpStrategy.put("place", place);
            tmpStrategy.put("transportation", transportation);
            tmpStrategy.put("price", price);
            tmpStrategy.put("commentText", commentText);
            tmpStrategy.put("commentRadio", commentRadio);
            tmpStrategy.put("recommendation", recommendation);
            tmpStrategy.put("picNum", picNum);
            
            certainUser.put(title, tmpStrategy);
            if (flag == 0) {
                origin.put(openid, certainUser);
            }
    
            System.out.println(tmpStrategy);
            System.out.println(certainUser);
            System.out.println(origin);
        
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    
        try (FileWriter file = new FileWriter("src/main/data/nodes.json")) {
            file.write(origin.toJSONString());
            file.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }

        
        return "post成功";
    }
    
    @RequestMapping(value="/postStrategy", method=RequestMethod.POST)
    public String postStrategy(
            @RequestParam(value="openid", required=true) String openid,
            @RequestParam(value="title", required=true) String title,
            @RequestParam(value="abstract", required=true) String abst,
            @RequestParam(value="nodes", required=true) ArrayList nodes
    ) {
        
        JSONParser jsonParser = new JSONParser();
        JSONObject origin = new JSONObject();
        try (FileReader reader = new FileReader("src/main/data/strategies.json")) {
            Object obj = jsonParser.parse(reader);
            int flag = 1;
            
            origin = (JSONObject) obj;
            JSONObject certainUser = (JSONObject) origin.get(openid);
            
            if (certainUser == null) {
                certainUser = new JSONObject();
                flag = 0;
            }
            
            JSONObject tmpStrategy = new JSONObject();
            
            tmpStrategy.put("abstract", abst);
            tmpStrategy.put("nodes", nodes);
            
            certainUser.put(title, tmpStrategy);
            if (flag == 0) {
                origin.put(openid, certainUser);
            }
            
            System.out.println(tmpStrategy);
            System.out.println(certainUser);
            System.out.println(origin);
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        
        try (FileWriter file = new FileWriter("src/main/data/strategies.json")) {
            file.write(origin.toJSONString());
            file.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        
        return "post成功";
    }
    
    @PostMapping("/uploadPic")
    public String uploadPic(
            @RequestParam(value="genre", required=false, defaultValue="pic") String genre,
            @RequestParam(value="openid", required=true) String openid,
            @RequestParam(value="nodeName", required=true) String nodeName,
            @RequestParam(value="index", required=true) String index,
            @RequestParam("file") MultipartFile file
            ) {
        String fileName = file.getOriginalFilename();
        String suffix = fileName.substring(fileName.lastIndexOf("."));
        File dest;
        if (suffix.isEmpty()) {
            dest = new File(this.picPath+"/"+openid+"/"+nodeName+"-"+index+".png");
        } else {
            dest = new File(this.picPath+"/"+openid+"/"+nodeName+"-"+index+".png");
        }
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }
        
        int flag = 0;
    
        try {
            file.transferTo(dest);
            flag = 1;
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        if (flag == 1) return "图片上传成功";
        else return "error";
    }
    
    @GetMapping(value="/downloadPic")
    public ResponseEntity<Object> downloadPic(
            @RequestParam(value="openid", required=false, defaultValue="general") String openid,
            @RequestParam(value="nodeName") String nodeName,
            @RequestParam(value="index") String index
    ) {
        try {
            nodeName = java.net.URLDecoder.decode(nodeName, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        System.out.println(nodeName);
        try {
            String filename = this.picPath+"/"+openid+"/"+nodeName+"-"+index+".png";
            File file = new File(filename);
    
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content Disposition", String.format("attachment; filename=\"%s\"", file.getName()));
            System.out.println(file.getName());
            
            ResponseEntity<Object> result = ResponseEntity.ok().headers(headers).contentLength(file.length()).contentType(MediaType.IMAGE_PNG).body(resource);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null;
    }

}
